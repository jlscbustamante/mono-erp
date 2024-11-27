import { StockGeneral } from '../entities'
import { StockRepository } from '../entities/repositories/stock.repository'

interface PropsRun {
  start: string
  end: string
}

export class ReadStock {
  constructor(private readonly stockRepository: StockRepository) {}

  async run(
    warehouseCode: string,
    { start, end }: PropsRun,
  ): Promise<{
    stock: StockGeneral[]
    lastClosed: string | null
  }> {
    let stock: { stock: StockGeneral[]; lastClosed: string | null }
    if (start == end) {
      stock = await this.stockRepository.getStockByDate(warehouseCode, start)
    } else {
      stock = await this.stockRepository.getRangeStock(
        warehouseCode,
        start,
        end,
      )
    }
    return stock ?? []
  }
}
