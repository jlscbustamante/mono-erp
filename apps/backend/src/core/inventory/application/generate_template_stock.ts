import { format, parseISO, sub } from 'date-fns'
import { StockItemToCreateDto } from '../dto'
import { STOCK_STATUS, StockGeneral } from '../entities'
import { Item } from '../entities/item'
import { ItemRepository } from '../entities/repositories/item.repository'
import { StockRepository } from '../entities/repositories/stock.repository'
import { TemplateRepository } from '../entities/repositories/template.repository'
import { calculateCurrent } from '../entities/util'
import { validateDates as validateDatesRule } from '../rules/validateDates'

export class GenerateTemplateEditStock {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly templateRepository: TemplateRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async run(
    warehouseCode: string,
    date: string,
  ): Promise<StockItemToCreateDto[]> {
    const { stock, lastClosed: dateClosed } =
      await this.stockRepository.getStockByDate(warehouseCode, date)

    this.validateDates(dateClosed, date, warehouseCode)

    const { template: stockTemplate, isWarehouse } =
      await this.templateRepository.getDynamicStockTemplate(warehouseCode)

    if (dateClosed == date || dateClosed == null) {
      // const wrappedStock = this.wrapperStockInTemplate({
      //   date,
      //   stock,
      //   template: stockTemplate,
      //   warehouseCode,
      // })
      // return wrappedStock
      return stock satisfies StockItemToCreateDto[]
    }

    if (stockTemplate.length == 0)
      throw new Error('No se encontro la plantilla o esta vacia')

    const stockClosed =
      await this.stockRepository.getLastClosedStock(warehouseCode)

    // se asume que es ultimo stock cerrado no es el mismo que el stock provisional
    // xq el ya se valido arriba
    return this.generateNewStock({
      template: stockTemplate,
      stockClosed: stockClosed ?? [],
      date,
      provitionalStock: stock,
      warehouseCode,
      isWarehouse,
    })
  }

  async runWithoutValidate(
    warehouseCode: string,
    date: string,
  ): Promise<StockItemToCreateDto[]> {
    const { stock, lastClosed: dateClosed } =
      await this.stockRepository.getStockByDate(warehouseCode, date)

    // this.validateDates(dateClosed, date, warehouseCode)

    const { template: stockTemplate, isWarehouse } =
      await this.templateRepository.getDynamicStockTemplate(warehouseCode)

    if (dateClosed == date || dateClosed == null) {
      // const wrappedStock = this.wrapperStockInTemplate({
      //   date,
      //   stock,
      //   template: stockTemplate,
      //   warehouseCode,
      // })
      // return wrappedStock
      return stock satisfies StockItemToCreateDto[]
    }

    if (stockTemplate.length == 0)
      throw new Error('No se encontro la plantilla o esta vacia')

    const stockClosed =
      await this.stockRepository.getLastClosedStock(warehouseCode)

    // se asume que es ultimo stock cerrado no es el mismo que el stock provisional
    // xq el ya se valido arriba
    return this.generateNewStock({
      template: stockTemplate,
      stockClosed: stockClosed ?? [],
      date,
      provitionalStock: stock,
      warehouseCode,
      isWarehouse,
    })
  }

  async templateToReset(
    warehouseCode: string,
    date: string,
  ): Promise<StockItemToCreateDto[]> {
    const { stock, lastClosed: dateClosed } =
      await this.stockRepository.getStockByDate(warehouseCode, date)

    // this.validateDates(dateClosed, date, warehouseCode)

    const { template: stockTemplate, isWarehouse } =
      await this.templateRepository.getDynamicStockTemplate(warehouseCode)

    if (dateClosed == date || dateClosed == null) {
      // const wrappedStock = this.wrapperStockInTemplate({
      //   date,
      //   stock,
      //   template: stockTemplate,
      //   warehouseCode,
      // })
      // return wrappedStock
      return stock satisfies StockItemToCreateDto[]
    }

    if (stockTemplate.length == 0)
      throw new Error('No se encontro la plantilla o esta vacia')

    const beforeDay = format(sub(parseISO(date), { days: 1 }), 'yyyy-MM-dd')
    const { stock: stockBefore, lastClosed } =
      await this.stockRepository.getStockByDate(warehouseCode, beforeDay)
    const beforeIsClosed = lastClosed == beforeDay

    return this.generateNewStock({
      template: stockTemplate,
      stockClosed: beforeIsClosed ? stockBefore : [],
      date,
      provitionalStock: stock,
      warehouseCode,
      isWarehouse,
    })
  }

  private validateDates(dateClosed: string | null, date: string, code: string) {
    const error = validateDatesRule(dateClosed, date, code)
    if (error) throw new Error(error)
  }

  private async generateNewStock(args: {
    template: Item[]
    stockClosed: StockGeneral[]
    provitionalStock: StockGeneral[]
    date: string
    warehouseCode: string
    isWarehouse: boolean
  }): Promise<StockItemToCreateDto[]> {
    const {
      template,
      stockClosed,
      provitionalStock,
      date,
      warehouseCode,
      isWarehouse,
    } = args
    const newStock: StockItemToCreateDto[] = []
    const templateIds = template.map((el) => el.id)
    const itemsInClosedStock = stockClosed
      .filter((el) => el.stockPhysical > 0)
      .map((el) => el.itemId)
    const itemInProvisionalStock = provitionalStock.map((el) => el.itemId)
    const usedItemIds = [...itemsInClosedStock, ...itemInProvisionalStock]
    const itemsNotInTemplate = usedItemIds.filter(
      (el) => !templateIds.includes(el),
    )
    const allItems = [...template]
    if (itemsNotInTemplate.length > 0) {
      const usedItems = await this.itemRepository.getItems(itemsNotInTemplate)
      allItems.push(...usedItems)
    }
    for (const itemTemplate of allItems) {
      const itemInClosed = stockClosed.find(
        (el) => el.itemId == itemTemplate.id,
      )
      const itemInProvisional = provitionalStock.find(
        (el) => el.itemId == itemTemplate.id,
      )
      const newItem: StockItemToCreateDto = this.getDefaultStockCreate(
        itemTemplate,
        date,
        warehouseCode,
        isWarehouse,
      )
      if (!itemInClosed && !itemInProvisional) {
        newStock.push(newItem)
      } else {
        newItem.initialStock = itemInClosed?.stockPhysical ?? 0
        newItem.totalInitial = itemInClosed?.totalValue ?? 0
        newItem.quantityInDispatch = itemInProvisional?.quantityInDispatch ?? 0
        newItem.quantityInMv = itemInProvisional?.quantityInMv ?? 0
        newItem.quantityInPurchase = itemInProvisional?.quantityInPurchase ?? 0

        newItem.quantityOutDispatch =
          itemInProvisional?.quantityOutDispatch ?? 0
        newItem.quantityOutMv = itemInProvisional?.quantityOutMv ?? 0
        newItem.quantityOutSale = itemInProvisional?.quantityOutSale ?? 0

        newItem.stockCurrent = calculateCurrent(isWarehouse, {
          initialStock: newItem.initialStock,
          quantityInDispatch: newItem.quantityInDispatch,
          quantityInMv: newItem.quantityInMv,
          quantityInPurchase: newItem.quantityInPurchase,
          quantityOutDispatch: newItem.quantityOutDispatch,
          quantityOutMv: newItem.quantityOutMv,
        })
        // newItem.initialStock + newItem.quantityIn - newItem.quantityOut
        newItem.stockPhysical = 0
        newItem.totalValue = 0

        newStock.push(newItem)
      }
    }

    return newStock
  }

  private getDefaultStockCreate(
    item: Item,
    date: string,
    warehouseCode: string,
    isWarehouse: boolean,
  ): StockItemToCreateDto {
    return {
      createdBy: 'sys',
      itemId: item.id,
      categoryName: item.categoryName,
      itemName: item.name,
      measureId: item.measureId,
      presentationId: item.presentationId,
      presentationName: item.presentationName,
      initialStock: 0,
      totalInitial: 0,
      quantityInDispatch: 0,
      quantityInPurchase: 0,
      quantityOutDispatch: 0,
      quantityOutSale: 0,
      stockCurrent: 0,
      stockPhysical: 0,
      unitValue: isWarehouse ? item.warehousePrice : item.storePrice,
      totalValue: 0,
      stockAt: date,
      status: STOCK_STATUS.AUTOGENERATED,
      warehouseId: warehouseCode,
      quantityInMv: 0,
      quantityOutMv: 0,
    }
  }
}
