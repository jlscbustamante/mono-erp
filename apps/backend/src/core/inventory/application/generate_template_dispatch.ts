import { measureRepository } from '../../../repositories/inventory/measure.repository'
import { StockRepository } from '../entities/repositories/stock.repository'
import { TemplateRepository } from '../entities/repositories/template.repository'

interface Data {
  id: number
  name: string
  measureCode: string
  measureName: string
  unitPrice: number
  presentationId: number
  presentation: string
  categoryName: string
  lastQuantity: number
  lastQuantityMeasureCode: string
}

export class GenerateTemplateDispatch {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly templateRepository: TemplateRepository,
  ) {}

  async run(warehouseCode: string) {
    const lastStock =
      (await this.stockRepository.getLastClosedStock(warehouseCode)) ?? []
    const storeTemplate = await this.templateRepository.getTemplate(false)
    const measures = await measureRepository.find({})

    const mapped: Data[] = []
    for (const item of storeTemplate) {
      const itemDispatch = item.getItemDispatch()
      const itemStock = item.getItemStock()
      const measure = measures.find((el) => el.id === itemDispatch.measureId)
      const itemInStock = lastStock.find((el) => el.itemId === itemStock.id)

      const measureInStock = itemInStock
        ? measures.find((el) => el.id === itemInStock.measureId)
        : null
      const quantity = itemInStock?.stockPhysical ?? 0
      // const transformedQuantity = item.getDispatchQuantity(quantity)
      const measureCodeInStock = measureInStock?.code ?? ''

      mapped.push({
        id: itemDispatch.id,
        name: itemDispatch.name,
        categoryName: itemDispatch.categoryName,
        measureCode: measure?.code ?? '',
        measureName: measure?.measure ?? '',
        presentation: itemDispatch.presentationName,
        presentationId: itemDispatch.presentationId,
        unitPrice: itemDispatch.storePrice,
        // lastQuantity: Number(transformedQuantity.toFixed(3)),
        lastQuantity: quantity,
        lastQuantityMeasureCode: measureCodeInStock,
      })
    }
    return mapped
  }
}
