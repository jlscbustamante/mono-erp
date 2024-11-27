import { MoveBetweenStoresDto, StockItemToCreateDto } from '../dto'
import { DISPATCH_STATUS } from '../entities/dispatch'
import { DispatchRepository } from '../entities/repositories/dispatch.repository'
import { StockRepository } from '../entities/repositories/stock.repository'
import { validateDates } from '../rules/validateDates'
import { GenerateTemplateEditStock } from './generate_template_stock'

export class MoveBetweenStores {
  constructor(
    private readonly generateEditTemplate: GenerateTemplateEditStock,
    private readonly stockRepository: StockRepository,
    private readonly dispatchRepository: DispatchRepository,
  ) {}

  async run(data: MoveBetweenStoresDto) {
    const date = data.moveAt.split(' ')[0]
    // se sabe que son items de inventario, osea que no necesitan ser transformados
    // osea solo mover la cantidad e los inventarios
    if (data.items.length == 0)
      throw new Error('No se puede crear un movimiento sin items')
    // await this.validateDates(data)
    const { from, to } = await this.getTemplates(data)
    this.validateTemplates(data, { from, to })
    const { from: newFrom, to: newTo } = this.modifyQuantity(data, { from, to })
    const dispatchId = await this.dispatchRepository.createMovement(
      data,
      DISPATCH_STATUS.NEW,
      'sys',
    )
    const newFromCleaned = newFrom.filter((el) => {
      const sum =
        el.initialStock +
        el.quantityInDispatch +
        el.quantityOutDispatch +
        el.quantityInMv +
        el.quantityOutMv +
        el.quantityInPurchase +
        el.quantityOutSale +
        el.stockCurrent +
        el.stockPhysical
      return sum > 0
    })
    const newToCleaned = newTo.filter((el) => {
      const sum =
        el.initialStock +
        el.quantityInDispatch +
        el.quantityOutDispatch +
        el.quantityInMv +
        el.quantityOutMv +
        el.quantityInPurchase +
        el.quantityOutSale +
        el.stockCurrent +
        el.stockPhysical
      return sum > 0
    })
    await this.stockRepository.saveMultipleStock(
      [...newFromCleaned, ...newToCleaned],
      date,
      [data.storeFrom, data.storeToId],
    )
    await this.dispatchRepository.changeStatus(
      dispatchId,
      DISPATCH_STATUS.DISPATCHED,
    )
  }

  private modifyQuantity = (
    data: MoveBetweenStoresDto,
    {
      from,
      to,
    }: {
      from: StockItemToCreateDto[]
      to: StockItemToCreateDto[]
    },
  ): {
    from: StockItemToCreateDto[]
    to: StockItemToCreateDto[]
  } => {
    const newFrom: StockItemToCreateDto[] = from.map((el) => {
      const itemData = data.items.find((el2) => el2.itemId == el.itemId)
      if (itemData) {
        const quantity = el.quantityOutMv + itemData.quantity
        return {
          ...el,
          quantityOutMv: quantity,
          stockCurrent: el.stockCurrent - itemData.quantity,
        }
      }
      return el
    })
    const newTo: StockItemToCreateDto[] = to.map((el) => {
      const itemData = data.items.find((el2) => el2.itemId == el.itemId)
      if (itemData) {
        const quantity = el.quantityInMv + itemData.quantity
        return {
          ...el,
          quantityInMv: quantity,
          stockCurrent: el.stockCurrent + itemData.quantity,
        }
      }
      return el
    })

    return {
      from: newFrom,
      to: newTo,
    }
  }

  private validateTemplates = (
    data: MoveBetweenStoresDto,
    {
      from,
      to,
    }: {
      from: StockItemToCreateDto[]
      to: StockItemToCreateDto[]
    },
  ) => {
    const item = data.items
    for (const el of item) {
      const itemInFrom = from.find((el) => el.itemId == el.itemId)
      const itemInTo = to.find((el) => el.itemId == el.itemId)
      if (!itemInFrom || !itemInTo)
        throw new Error(
          `No se encontro el itemId : ${el.itemId} en la plantilla`,
        )
    }
  }

  private async validateDates(data: MoveBetweenStoresDto) {
    const [dateClosedOne, dateClosedTwo] = await Promise.all([
      this.stockRepository.getLastClosedDate(data.storeToId),
      this.stockRepository.getLastClosedDate(data.storeFrom),
    ])
    this.verifyDates(dateClosedOne, data.moveAt, data.storeToId)
    this.verifyDates(dateClosedTwo, data.moveAt, data.storeFrom)
  }
  private verifyDates(dateClosed: string | null, moveAt: string, code: string) {
    const error = validateDates(dateClosed, moveAt, code)
    if (error) throw new Error(error)
  }

  private async getTemplates(data: MoveBetweenStoresDto) {
    const [from, to] = await Promise.all([
      this.generateEditTemplate.run(data.storeFrom, data.moveAt),
      this.generateEditTemplate.run(data.storeToId, data.moveAt),
    ])
    return { from, to }
  }
}
