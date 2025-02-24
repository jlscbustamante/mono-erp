import { badRequest } from '@hapi/boom'
import { Request, Response } from 'express'
import { In } from 'typeorm'

import { configHosts } from '../../config/configHosts'
import { AppDataSource } from '../../config/database'
import { SucursalSale } from '../../entities/adm/SucursalSale'
import { CashMove } from '../../entities/CashMove'
import cashAccountRepository from '../../repositories/cashAccount.repository'
import cashMoveRepository from '../../repositories/cashMove.repository'
import categoryRepository from '../../repositories/category.repository'
import sucursalRepository from '../../repositories/sucursal.repository'
import { sucursaSaleRepository } from '../../repositories/sucursalSales.repository'
import { IToken } from '../../types'
import { CashMoveFlow, CashMoveStatus } from '../../types/cashMove'
import { CategoryAccountFlow } from '../../types/category'
import { catchError } from '../../utils/decorators'

export interface IPosMove {
  code: string
  username: string
  date: string
  categories: IPosMoveCategory[]
}

interface IPosMoveCategory {
  categoryId: number
  amount: number
  description?: string
}

export class PosController {
  @catchError
  async createMoves(req: Request, res: Response): Promise<void> {
    const data = req.body as IPosMove

    await createMovepriv(data)

    res.status(200).json({ message: 'Movimientos creados correctamente' })
  }

  @catchError
  async resetStoreData(req: Request, res: Response) {
    const token = req.headers.token as unknown as IToken
    const { cashId, date } = req.body as { cashId: number; date: string }
    const cashAccount = await cashAccountRepository.findOne({
      where: { id: cashId },
    })
    if (!cashAccount) throw badRequest('Caja no encontrada')
    const sucursal = await sucursalRepository.findOne({
      where: { id: cashAccount.codefis },
    })
    if (!sucursal) throw badRequest('Sucursal no encontrada')

    const data = await getNewData(sucursal.id, date)
    if (data.createMoves.length == 0 && data.sucursal_sales.length == 0)
      return res.status(200).json({ message: 'Ok' })
    // throw badRequest('No se encontraron movimientos en el pos')

    await AppDataSource.transaction(async (manager) => {
      await manager.query(
        `DELETE FROM adm_sucursal_move WHERE cash_id = ${cashId} AND DATE(requested_at) = '${date}'`,
      )
      await manager.query(
        `DELETE FROM sls_sucursal_sales WHERE store_id = '${sucursal.id}' AND DATE(sales_at) = '${date}'`,
      )
    })

    await createMovepriv({
      code: sucursal.id,
      username: token.name,
      categories: data.createMoves,
      date: date,
    })
    await sucursaSaleRepository.insert({
      ...data.sucursal_sales,
      store_id: sucursal.id,
    })

    return res.status(200).json({ message: 'Ok' })
  }

  @catchError
  async updateInfoStore(req: Request, res: Response) {
    const storeCode = req.body.storeCode as string
    const info = await getStoreInfo(storeCode)

    await sucursalRepository.update(
      {
        id: storeCode,
      },
      {
        title: info.title,
        ubi_address: info.ubi_address,
        ubi_district: info.ubi_district,
        ubi_city: info?.ubi_city ?? 'LIMA',
        sede_nro_ruc: info.sede_nro_ruc,
        legalperson_name: info.sede_razon_social,
        efact_pass: info.efact_pass,
        cfd_serie: info.cfd_serie_fa,
        cfd_correlativo: info.cfd_seql_fa,
        cfd_serie_bo: info.cfd_serie_bo,
        cfd_seql_bo: info.cfd_sql_bo,
      },
    )

    return res.json({
      message: 'ok',
    })
  }
}

const getStoreInfo = async (storeCode: string) => {
  try {
    const request = await fetch(
      `${configHosts.central}/api/backoffice/storesInfo?codeStore=${storeCode}`,
    )
    const { result, error } = await request.json()
    if (!result || !result[0])
      throw new Error('No se obtuvo la información de la tienda')

    if (error) throw new Error(error)
    const info = result[0] as {
      id: number
      title: string
      ubi_address: string
      ubi_district: string
      ubi_city: string
      sede_nro_ruc: string
      sede_razon_social: string
      efact_pass: string
      cfd_serie_fa: string
      cfd_seql_fa: number
      cfd_serie_bo: string
      cfd_sql_bo: number
    }

    return info
  } catch (err: any) {
    console.log(err)
    throw new Error(
      'Error al obtener la información de la tienda desde la central',
    )
  }
}
const getNewData = async (code: string, date: string) => {
  const request = await fetch(
    `https://pos.pizzaraul.com/api/store/getSalesTransactionByCode?store_code=${code}&date=${date}`,
  )
  if (!request.ok) throw new Error('Error api pos')
  const data = await request.json()
  return data as {
    createMoves: IPosMoveCategory[]
    sucursal_sales: Partial<SucursalSale>[]
    store: string
    date: string
  }
}

const createMovepriv = async (data: IPosMove) => {
  const storeCode = data.code
  const categoryIds = data.categories.map((cat) => cat.categoryId)
  const [categories, store] = await Promise.all([
    categoryRepository.find({
      where: { id: In(categoryIds) },
    }),
    cashAccountRepository.findOne({ where: { codefis: storeCode } }),
  ])
  if (categories.length == 0)
    throw badRequest('No se encontraron categorias con los ids recibidos')
  if (!store)
    throw badRequest(`No se encontro la tienda con el codigo ${storeCode}`)

  const moves: CashMove[] = []
  for (const category of data.categories) {
    const categoryFounded = categories.find(
      (cat) => cat.id == category.categoryId,
    )
    if (!categoryFounded)
      throw new Error(
        `No se encontro una de las categorias pasadas ${category.categoryId} : ${category.description}`,
      )
    const newCashMove = new CashMove()
    newCashMove.amount = category.amount
    newCashMove.description = category.description ?? ''
    newCashMove.account_flow =
      categoryFounded.account_flow == CategoryAccountFlow.In
        ? CashMoveFlow.In
        : CashMoveFlow.Out
    newCashMove.status = CashMoveStatus.Active
    newCashMove.category_expense_id = categoryFounded.id
    newCashMove.category_account_id = categoryFounded.account_id
    newCashMove.created_by = data.username
    newCashMove.requested_at = data.date
    newCashMove.cash_id = store.id
    newCashMove.cash_account_id = store.account_id
    moves.push(newCashMove)
  }

  await cashMoveRepository.insert(moves)
}
