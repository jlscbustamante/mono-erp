import { StockRepository } from '../../entities/repositories/stock.repository'
import { WarehousesRepository } from '../../entities/repositories/warehouses.repository'

interface InventoryStoreReport {
  hasStock: boolean
  initial: number
  ending: number
  totalFromWarehouse: number
  totalFromStore: number
  totalOutStore: number
}

export class ReportRepository {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly warehouseRepository: WarehousesRepository,
  ) {}

  async inventoryStoreReport({
    start,
    end,
    sucursalCode,
  }: {
    start: string
    end: string
    sucursalCode: string
  }): Promise<InventoryStoreReport> {
    const isWarehouse = await this.warehouseRepository.isWarehouse(sucursalCode)
    if (isWarehouse)
      throw new Error(
        'El reporte de inventario solo esta disponible para tiendas',
      )

    const stocksByDate = await this.stockRepository.rangeStockByDate({
      start,
      end,
      warehouseCode: sucursalCode,
    })

    const hasStock = stocksByDate.some((stocks) => stocks.length > 0)

    const initial = stocksByDate[0].reduce(
      (acc, curr) => acc + curr.totalInitial,
      0,
    )

    const ending = stocksByDate[stocksByDate.length - 1].reduce(
      (acc, curr) => acc + curr.totalValue,
      0,
    )
    const totalFromStore = stocksByDate
      .map((stocks) => {
        return stocks.reduce(
          (acc, curr) => acc + curr.quantityInMv * curr.unitValue,
          0,
        )
      })
      .reduce((acc, curr) => acc + curr, 0)

    const totalFromWarehouse = stocksByDate
      .map((stocks) => {
        return stocks.reduce(
          (acc, curr) => acc + curr.quantityInDispatch * curr.unitValue,
          0,
        )
      })
      .reduce((acc, curr) => acc + curr, 0)

    const totalOutStore = stocksByDate
      .map((stocks) => {
        return stocks.reduce(
          (acc, curr) => acc + curr.quantityOutMv * curr.unitValue,
          0,
        )
      })
      .reduce((acc, curr) => acc + curr, 0)

    return {
      ending,
      hasStock,
      initial: Number(initial.toFixed(2)),
      totalFromStore,
      totalFromWarehouse,
      totalOutStore,
    }
  }
}
