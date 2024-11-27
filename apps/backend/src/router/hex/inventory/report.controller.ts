import { type Request, type Response } from 'express'

import { ReportRepository } from '../../../core/inventory/infrastructure/repositories/report.repository'
import { catchError } from '../../../utils/decorators'
import { stockRepository, warehouseRepository } from '../dependencies'

interface InventoryReport {
  tieneInventario: boolean
  saldoInicial: number
  saldoFinal: number
  totalDeAlmacenes: number
  totalEntradaDeTienda: number
  totalDespachoATienda: number
}

const reportRepository = new ReportRepository(
  stockRepository,
  warehouseRepository,
)

export class HexInventoryReportController {
  @catchError
  async inventoryReport(req: Request, res: Response) {
    const { start, end, sucursalCode } = req.query as {
      start: string
      end: string
      sucursalCode: string
    }
    const data = await reportRepository.inventoryStoreReport({
      end,
      start,
      sucursalCode,
    })

    return res.json({
      message: 'ok',
      data: {
        saldoFinal: data.ending,
        saldoInicial: data.initial,
        tieneInventario: data.hasStock,
        totalDeAlmacenes: data.totalFromWarehouse,
        totalDespachoATienda: data.totalOutStore,
        totalEntradaDeTienda: data.totalFromStore,
      } satisfies InventoryReport,
    })
  }

  @catchError
  async inventoryReportOneDate(req: Request, res: Response) {
    const { date, sucursalCode } = req.query as {
      date: string
      sucursalCode: string
    }
    const data = await reportRepository.inventoryStoreReport({
      end: date,
      start: date,
      sucursalCode,
    })

    return res.json({
      message: 'ok',
      data: {
        saldoFinal: data.ending,
        saldoInicial: data.initial,
        tieneInventario: data.hasStock,
        totalDeAlmacenes: data.totalFromWarehouse,
        totalDespachoATienda: data.totalOutStore,
        totalEntradaDeTienda: data.totalFromStore,
      } satisfies InventoryReport,
    })
  }
}
