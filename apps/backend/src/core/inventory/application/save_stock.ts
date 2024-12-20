import { cacheApi } from '../../../lib/cache'
import { DispatchUtil } from '../dispatch-util.service'
import { StockItemToCreateDto } from '../dto'
import { STOCK_STATUS } from '../entities'
import { DispatchRepository } from '../entities/repositories/dispatch.repository'
import { StockRepository } from '../entities/repositories/stock.repository'
import { validateDates } from '../rules/validateDates'
import { GenerateTemplateEditStock } from './generate_template_stock'

export class SaveStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly dispatchRepository: DispatchRepository,
    private readonly generateTemplate: GenerateTemplateEditStock,
    private readonly dispatchUtils: DispatchUtil,
  ) {}

  async run(
    stock: StockItemToCreateDto[],
    date: string,
    warehouseCode: string,
    isManual?: boolean,
  ) {
    if (stock.length == 0) throw new Error('No se puede guardar un stock vacio')
    const dateClosed =
      await this.stockRepository.getLastClosedDate(warehouseCode)
    this.verifyDates(dateClosed, date, warehouseCode)

    const constantStock = await this.setDefaultData(stock, date, warehouseCode)
    const stockToCreate = this.cleanItems(constantStock)
    if (isManual) {
      await this.validateDispatch(date, warehouseCode)
    }
    if (isManual == true || dateClosed == date) {
      await this.stockRepository.saveStock(
        stockToCreate.map((el) => ({
          ...el,
          status: STOCK_STATUS.CLOSED,
        })),
        date,
        warehouseCode,
      )
      await this.dispatchUtils.fixTotalLast(warehouseCode, date)
      cacheApi.delete(`last_closed_${warehouseCode}`)
      cacheApi.delete(`template_dispatch_${warehouseCode}`)
      cacheApi.delete(`template_dispatch_pr_${warehouseCode}`)
    } else {
      await this.stockRepository.saveStock(stockToCreate, date, warehouseCode)
    }
  }

  private async validateDispatch(date: string, warehouseId: string) {
    const count = await this.dispatchRepository.countPendingDispatchBeforeAt(
      date,
      warehouseId,
    )
    if (count > 0)
      throw new Error(
        'No se puede guardar un stock con despachos pendientes con fecha ' +
          date +
          ' o anterior',
      )
  }

  cleanItems(stock: StockItemToCreateDto[]) {
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
        item.stockPhysical == 0 &&
        item.stockCurrent == 0
      )
        continue
      else finalStock.push(item)
    }
    if (finalStock.length == 0) finalStock.push(stock[0])
    return finalStock
  }

  private verifyDates(closedDate: string | null, date: string, code: string) {
    const error = validateDates(closedDate, date, code)
    if (error) throw new Error(error)
  }

  private async setDefaultData(
    stock: StockItemToCreateDto[],
    date: string,
    warehouseId: string,
  ): Promise<StockItemToCreateDto[]> {
    const template = await this.generateTemplate.run(warehouseId, date)
    const newStock: StockItemToCreateDto[] = []
    for (const item of stock) {
      const itemInTemplate = template.find((el) => el.itemId == item.itemId)
      if (!itemInTemplate) {
        newStock.push({
          ...item,
          initialStock: 0,
          totalInitial: 0,
        })
      } else {
        const quantityPhysical = item.stockPhysical ?? 0
        newStock.push({
          ...itemInTemplate,
          stockPhysical: quantityPhysical,
          totalValue: quantityPhysical * itemInTemplate.unitValue,
        })
      }
    }

    return newStock
  }
}
