import { StockItemToCreateDto } from '../dto'
import { STOCK_STATUS } from '../entities'
import { StockRepository } from '../entities/repositories/stock.repository'
import { validateDatesDispatch } from '../rules/validateDates'

export class SaveBiStock {
  constructor(private readonly stockRepository: StockRepository) {}

  async run(
    stockOne: StockItemToCreateDto[],
    stockTwo: StockItemToCreateDto[],
    date: string,
    warehouseCode: [string, string],
  ) {
    if (stockOne.length == 0 || stockTwo.length == 0)
      throw new Error('No se puede guardar un stock vacio')

    const [dateClosedOne, dateClosedTwo] = await Promise.all([
      this.stockRepository.getLastClosedDate(warehouseCode[0]),
      this.stockRepository.getLastClosedDate(warehouseCode[1]),
    ])
    this.verifyDates(dateClosedOne, date)
    this.verifyDates(dateClosedTwo, date)

    let stockToCreateOne = this.cleanItems(stockOne)
    let stockToCreateTwo = this.cleanItems(stockTwo)

    if (dateClosedOne == date) {
      stockToCreateOne = stockToCreateOne.map((el) => ({
        ...el,
        status: STOCK_STATUS.CLOSED,
      }))
    }
    if (dateClosedTwo == date) {
      stockToCreateTwo = stockToCreateTwo.map((el) => ({
        ...el,
        status: STOCK_STATUS.CLOSED,
      }))
    }
    await this.stockRepository.saveMultipleStock(
      [...stockToCreateOne, ...stockToCreateTwo],
      date,
      warehouseCode,
    )
  }

  public async validate(date: string, warehouseCode: [string, string]) {
    const [dataClosedOne, dataClosedTwo] = await Promise.all([
      this.stockRepository.getLastInfoWarehouse(warehouseCode[0]),
      this.stockRepository.getLastInfoWarehouse(warehouseCode[1]),
    ])
    this.verifyDates(
      dataClosedOne.lastClosed,
      date,
      dataClosedOne.warehouseName,
    )
    this.verifyDates(
      dataClosedTwo.lastClosed,
      date,
      dataClosedTwo.warehouseName,
    )
  }

  private cleanItems(stock: StockItemToCreateDto[]) {
    const finalStock: StockItemToCreateDto[] = []
    for (const item of stock) {
      if (
        item.initialStock == 0 &&
        item.quantityInDispatch == 0 &&
        item.quantityInMv == 0 &&
        item.quantityInPurchase == 0 &&
        item.quantityOutDispatch == 0 &&
        item.quantityOutMv == 0 &&
        item.quantityOutSale == 0 &&
        item.stockCurrent == 0 &&
        item.stockPhysical == 0
      )
        continue
      else finalStock.push(item)
    }
    if (finalStock.length == 0) finalStock.push(stock[0])
    return finalStock
  }

  private verifyDates(
    closedDate: string | null,
    date: string,
    warehouseCode?: string,
  ) {
    const error = validateDatesDispatch(closedDate, date, warehouseCode)
    if (error) throw new Error(error)
  }
}
