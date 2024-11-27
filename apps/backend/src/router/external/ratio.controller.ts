import { format, parseISO, sub } from 'date-fns'
import { Request, Response } from 'express'
import { Raw } from 'typeorm'

import { Sucursal } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { catchError } from '../../utils/decorators'

interface RatioReport {
  code: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  invInicial: number
  despachado: number
  invFin: number
  consumo: number
}

interface Reporte {
  Fecha: string
  IdTienda: string
  Tienda: string
  IvInicial: string
  Despacho: string
  InTienda: string
  OutTienda: string
  IvFinal: string
  Consumo: string
  Venta: string
}

export class RatioController {
  @catchError
  async getRptVentaTienda(req: Request, res: Response) {
    const { stores, group: typeGroup } = req.query as {
      stores: string[] | undefined
      group: string | undefined
    }
    const group = typeGroup ? typeGroup : 1
    const { start, end } = req.query
    const storesFiltered = (stores && stores.filter((el) => el)) ?? []
    const storesFormatted = storesFiltered.map((el) => `'${el}'`).join(',')
    const queryIfThereStores =
      storesFiltered.length > 0
        ? `vrsvt.idTienda IN (${storesFormatted}) AND `
        : ''

    const data: Reporte[] = await AppDataSource.query(
      `SELECT * FROM view_rpt_stock_ventax_tienda vrsvt WHERE ${queryIfThereStores} vrsvt.Fecha BETWEEN '${start}' AND '${end}'`,
    )

    if (group == '2') {
      const groupedByStore = data.reduce(
        (acc, el) => {
          if (!acc[el.IdTienda]) {
            acc[el.IdTienda] = el
          } else {
            acc[el.IdTienda] = {
              ...acc[el.IdTienda],
              Despacho:
                Number(acc[el.IdTienda].Despacho) + Number(el.Despacho) + '',
              InTienda:
                Number(acc[el.IdTienda].InTienda) + Number(el.InTienda) + '',
              OutTienda:
                Number(acc[el.IdTienda].OutTienda) + Number(el.OutTienda) + '',
              Venta: Number(acc[el.IdTienda].Venta) + Number(el.Venta) + '',
            }
          }
          return acc
        },
        {} as Record<string, Reporte>,
      )
      const groupedData = Object.keys(groupedByStore).map((idTienda) => {
        const initial = data.find(
          (el) => el.IdTienda == idTienda && el.Fecha == start,
        )
        const final = data.find(
          (el) => el.IdTienda == idTienda && el.Fecha == end,
        )

        const initialValue = initial?.IvInicial ? Number(initial.IvInicial) : 0
        const finalValue = final?.IvFinal ? Number(final.IvFinal) : 0
        const inTienda = Number(groupedByStore[idTienda].InTienda)
        const outTienda = Number(groupedByStore[idTienda].OutTienda)
        const despachado = Number(groupedByStore[idTienda].Despacho)

        const consume =
          initialValue + inTienda + despachado - outTienda - finalValue

        return {
          Fecha: `${start} - ${end}`,
          IdTienda: idTienda,
          Despacho: groupedByStore[idTienda].Despacho,
          InTienda: groupedByStore[idTienda].InTienda,
          OutTienda: groupedByStore[idTienda].OutTienda,
          IvInicial: initial?.IvInicial ?? '0.00',
          IvFinal: final?.IvFinal ?? '0.00',
          Tienda: groupedByStore[idTienda].Tienda,
          Venta: groupedByStore[idTienda].Venta,
          Consumo: consume.toFixed(3),
        } satisfies Reporte
      })

      return res.json({
        isSuccess: true,
        data: groupedData,
      })
    }

    return res.json({
      isSuccess: true,
      data,
    })
  }

  @catchError
  async getRatioByStores(req: Request, res: Response) {
    const { stores, start, end } = req.body as {
      stores: string[]
      start: string
      end: string
    }
    const storesDB = await AppDataSource.getRepository(Sucursal).find({
      select: {
        id: true,
        title: true,
      },
      where: {
        type_sede: Raw((alias) => `(${alias}!='W' OR ${alias} IS NULL)`),
      },
      order: {
        title: 'ASC',
      },
    })
    const storesMap = storesDB.reduce(
      (acc, el) => {
        acc[el.id] = el
        return acc
      },
      {} as Record<string, Sucursal>,
    )
    let storesCode = []
    if (stores.length > 0) {
      storesCode = stores
    } else {
      storesCode = Object.keys(storesMap)
    }
    const beforeStart = format(sub(parseISO(start), { days: 1 }), 'yyyy-MM-dd')

    const initialValues: { warehouse_id: string; total: string }[] =
      await AppDataSource.query(
        'SELECT warehouse_id ,SUM(is2.total_value) total FROM inv_stock is2  WHERE DATE(stock_at)=? AND warehouse_id IN (?) GROUP BY is2.warehouse_id',
        [beforeStart, storesCode],
      )

    const dispatchValue: { warehouse_id: string; valor_despachado: string }[] =
      await AppDataSource.query(
        'SELECT warehouse_id, SUM(quantity_in * unit_value) AS valor_despachado FROM inv_stock WHERE DATE(stock_at) BETWEEN ? AND ? GROUP BY warehouse_id',
        [start, end],
      )

    const finalValues: { warehouse_id: string; total: string }[] =
      await AppDataSource.query(
        'SELECT warehouse_id ,SUM(is2.total_value) total FROM inv_stock is2  WHERE DATE(stock_at)=? AND warehouse_id IN (?) GROUP BY is2.warehouse_id',
        [start, storesCode],
      )

    const report: RatioReport[] = []

    for (const store of storesCode) {
      const inicial = initialValues.find(
        (el) => el.warehouse_id === store,
      )?.total
      const despachado = dispatchValue.find(
        (el) => el.warehouse_id === store,
      )?.valor_despachado
      const final = finalValues.find((el) => el.warehouse_id === store)?.total
      const inicialNumber = inicial ? Number(inicial) : 0
      const despachadoNumber = despachado ? Number(despachado) : 0
      const finalNumber = final ? Number(final) : 0
      const consumo = inicialNumber + despachadoNumber - finalNumber
      const newRatioReport: RatioReport = {
        code: store,
        fechaInicio: start,
        fechaFin: end,
        nombre: storesMap[store].title,
        invInicial: inicialNumber,
        despachado: despachadoNumber,
        invFin: finalNumber,
        consumo: Number(consumo.toFixed(2)),
      }
      report.push(newRatioReport)
    }

    return res.json({
      message: 'Ok',
      data: report,
    })
  }
}
