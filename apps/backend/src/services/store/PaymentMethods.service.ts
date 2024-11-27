import { badRequest } from '@hapi/boom'
import { Raw } from 'typeorm'

import {
  CATEGORY_ID_CULQI_POS,
  CATEGORY_ID_IZIPAY,
  CATEGORY_ID_PAGO_ONLINE,
} from '../../const'
import { CashMove } from '../../entities/CashMove'
import cashAccountRepository from '../../repositories/cashAccount.repository'
import { CashMoveRepository } from '../../repositories/cashMove.repository'
import categoryRepository from '../../repositories/category.repository'
import { ExtPagosCulqiRepository } from '../../repositories/store/ExtPagosCulqi.repository'
import { ExtPagosIzipayRepository } from '../../repositories/store/ExtPagosIzipay.repository'
import { CashMoveStatus } from '../../types/cashMove'
import { safeAny } from '../../utils/someAny'

export class PaymentMethodsService {
  constructor(
    private readonly extPagosCulqiRepository: ExtPagosCulqiRepository,
    private readonly extPagosIzipayRepository: ExtPagosIzipayRepository,
    private readonly cashMoveRepository: CashMoveRepository,
  ) {}

  async getInfoPaymentMethods(date: string, exclude?: string[]) {
    const [storeData, culqiData, izipayData] = await Promise.all([
      this.cashMoveRepository.getInfoPaymentMethods(date),
      this.extPagosCulqiRepository.getInfoPaymentMethods(date, exclude),
      this.extPagosIzipayRepository.getInfoPaymentMethods(date, exclude),
    ])
    const allsucursals = storeData
      .map((el) => el.sucursalcode)
      .concat(culqiData.map((el) => el.sucursalcode))
      .concat(izipayData.map((el) => el.sucursalcode))
    const distinctsucursals = [...new Set(allsucursals)].sort()
    const mapPosition = new Map<string, number>()
    const infoprueba = distinctsucursals.reduce((ac, el) => {
      if (!el) return ac
      if (!mapPosition.has(el)) {
        const dataFound = storeData.find((data) => data.sucursalcode == el)
        const onlineDataFound = Number(
          culqiData.find(
            (data) => data.sucursalcode == el && data.aplicacion == 'online',
          )?.amount ?? 0,
        )
        const culqiDataFound = Number(
          culqiData.find(
            (data) => data.sucursalcode == el && data.aplicacion == 'pos',
          )?.amount ?? 0,
        )
        const izipayDataFound = Number(
          izipayData.find((data) => data.sucursalcode == el)?.amount ?? 0,
        )
        const total = onlineDataFound + culqiDataFound + izipayDataFound
        const totalStore =
          Number(dataFound?.izipay ?? 0) + Number(dataFound?.online ?? 0)
        ac.push({
          sucursalcode: el,
          store: {
            ...dataFound,
            success: totalStore == total,
          },
          culqi: culqiDataFound,
          online: onlineDataFound,
          izipay: izipayDataFound,
          success: totalStore == total,
        })
      }
      return ac
    }, [] as any)

    return infoprueba ?? []
  }

  async getTransactionsByMethod(
    sucursalcode: string,
    date: string,
    method: 'online' | 'izipay' | 'culqi',
    exclude?: string[],
  ) {
    const excludeStatusQuery = exclude
      ? ` AND ei.estado NOT IN (${exclude
          .map((el) => "'" + el + "'")
          .join(',')})`
      : ''
    if (method == 'izipay') {
      return await this.extPagosCulqiRepository.query(
        `SELECT transactionkey id,sucursalcode,codigo terminal,ac.name,ei.fechadetransaccion date,ei.fechadeabono dateabono, ei.importe,ei.comision,ei.igv igv,ei.importeneto importeneto, ei.numdetarjeta numtarjeta,ei.estado estado FROM ext_pagos_izipay ei INNER JOIN adm_cash_account ac ON ei.sucursalcode=ac.sucursal_id WHERE sucursalcode=? AND DATE(ei.fechadetransaccion)=? ${excludeStatusQuery}`,
        [sucursalcode, date],
      )
    } else if (method == 'culqi') {
      return await this.extPagosCulqiRepository.query(
        `SELECT transactionkey id,sucursalcode, ei.terminal,ac.name,ei.fechadelatransaccion date,ei.fechadeabono dateabono, ei.montoventa importe,ei.comisionventa,ei.igvventa igv,ei.montoventa importeneto,ei.nrotarjeta numtarjeta,ei.estado estado FROM ext_pagos_culqi ei INNER JOIN adm_cash_account ac ON ei.sucursalcode=ac.sucursal_id WHERE sucursalcode=? AND DATE(ei.fechadelatransaccion)=? AND aplicacion='pos' ${excludeStatusQuery}`,
        [sucursalcode, date],
      )
    } else if (method == 'online') {
      return await this.extPagosCulqiRepository.query(
        `SELECT transactionkey id,sucursalcode, ei.terminal,ac.name,ei.fechadelatransaccion date,ei.fechadeabono dateabono, ei.montoventa importe,ei.comisionventa,ei.igvventa igv,ei.montoventa importeneto, ei.nrotarjeta numtarjeta,ei.estado estado FROM ext_pagos_culqi ei INNER JOIN adm_cash_account ac ON ei.sucursalcode=ac.sucursal_id WHERE sucursalcode=? AND DATE(ei.fechadelatransaccion)=? AND aplicacion='online' ${excludeStatusQuery}`,
        [sucursalcode, date],
      )
    }

    throw badRequest('El tipo de metodo no es valido, (izipay,culqi,online)')
  }

  async infoTerminal(sucursalcode: string, date: string, exclude?: string[]) {
    const excludeStatusQuery = exclude
      ? `AND estado NOT IN (${exclude.map((el) => `'${el}'`).join(',')})`
      : ''
    const info = await this.extPagosIzipayRepository
      .createQueryBuilder()
      .select(['codigo', '"izipay" method', 'sum(importe) amount'])
      .where(
        `DATE(fechadetransaccion)=:date AND sucursalcode = :sucursalcode ${excludeStatusQuery}`,
        { date, sucursalcode },
      )
      .groupBy('codigo')
      .execute()
    const infoculqi = await this.extPagosCulqiRepository.query(
      `SELECT terminal codigo,CASE WHEN aplicacion='pos' THEN 'culqi' ELSE 'online' END as method, sum(montoventa) amount FROM ext_pagos_culqi WHERE DATE(fechadelatransaccion)=? AND sucursalcode=? ${excludeStatusQuery} GROUP BY terminal`,
      [date, sucursalcode],
    )

    return info.concat(infoculqi)
  }

  async signReconciliation({
    cashId,
    date,
    user,
    sucursalCode,
    izipayAmount,
    culqiAmount,
  }: {
    cashId: number
    date: string
    user: string
    sucursalCode: string
    izipayAmount?: number
    culqiAmount?: number
    onlineAmount?: number
  }) {
    const izipay = await this.cashMoveRepository.findOne({
      where: {
        cash_id: cashId,
        requested_at: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        category_expense_id: CATEGORY_ID_IZIPAY,
      },
    })
    const pagoOnline = await this.cashMoveRepository.findOne({
      where: {
        cash_id: cashId,
        requested_at: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        category_expense_id: CATEGORY_ID_PAGO_ONLINE,
      },
    })

    const culqiOriginalPOS = await this.cashMoveRepository.findOne({
      where: {
        cash_id: cashId,
        requested_at: Raw((alias) => `DATE(${alias}) = :date`, { date }),
        category_expense_id: CATEGORY_ID_CULQI_POS,
      },
    })

    if (culqiAmount && !culqiOriginalPOS) {
      const culqiCategory = await categoryRepository.findOneBy({
        id: CATEGORY_ID_CULQI_POS,
      })
      if (!culqiCategory) throw badRequest('Culqi categoria no encontrada')
      const cashMove = await cashAccountRepository.findOneBy({ id: cashId })
      if (izipay) {
        await this.cashMoveRepository.update(izipay.id!, {
          amount: izipayAmount ?? 0,
        })
      }
      const newCuliPosMove: Partial<CashMove> = {
        amount: culqiAmount,
        account_flow: culqiCategory.account_flow as safeAny,
        cash_id: cashId,
        cash_account_id: cashMove?.account_id,
        category_expense_id: culqiCategory.id,
        category_account_id: culqiCategory.account_id,
        status: CashMoveStatus.Active,
        requested_at: date,
        created_by: user,
      }
      await this.cashMoveRepository.insert(newCuliPosMove)
    }

    let culqiPOS
    if (!culqiOriginalPOS && culqiAmount) {
      culqiPOS = await this.cashMoveRepository.findOne({
        where: {
          cash_id: cashId,
          requested_at: Raw((alias) => `DATE(${alias}) = :date`, { date }),
          category_expense_id: CATEGORY_ID_CULQI_POS,
        },
      })
    } else if (culqiOriginalPOS) {
      culqiPOS = culqiOriginalPOS
    }

    await this.cashMoveRepository
      .createQueryBuilder()
      .update()
      .set({ status: CashMoveStatus.Signed, approved_by: user })
      .where(
        'status=:status AND cash_id=:cash_id AND DATE(requested_at)=:requested_at AND category_expense_id IN (:...category_expense_id)',
        {
          status: CashMoveStatus.Active,
          cash_id: cashId,
          requested_at: date,
          category_expense_id: [
            CATEGORY_ID_IZIPAY,
            CATEGORY_ID_PAGO_ONLINE,
            CATEGORY_ID_CULQI_POS,
          ],
        },
      )
      .execute()

    if (izipay) {
      await this.extPagosIzipayRepository
        .createQueryBuilder()
        .update()
        .set({ cashmoveId: `J${izipay.id?.toString()}` })
        .where(
          'DATE(fechadetransaccion)=:date AND sucursalcode = :sucursalcode',
          { date, sucursalcode: sucursalCode },
        )
        .execute()
    }
    if (culqiPOS) {
      await this.extPagosCulqiRepository
        .createQueryBuilder()
        .update()
        .set({
          cashmoveId: `J${culqiPOS.id?.toString()}`,
        })
        .where(
          'DATE(fechadelatransaccion)=:date AND aplicacion="pos" AND sucursalcode = :sucursalcode',
          {
            date,
            sucursalcode: sucursalCode,
          },
        )
        .execute()
    }
    if (pagoOnline) {
      await this.extPagosCulqiRepository
        .createQueryBuilder()
        .update()
        .set({
          cashmoveId: `J${pagoOnline.id?.toString()}`,
        })
        .where(
          'DATE(fechadelatransaccion)=:date AND aplicacion="online" AND sucursalcode = :sucursalcode',
          {
            date,
            sucursalcode: sucursalCode,
          },
        )
        .execute()
    }
  }
}
