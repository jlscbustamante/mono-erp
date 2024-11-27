import { StockItemToCreateDto } from '../dto'
import { CreateInitialStockDto } from '../dto/create_initial_stock.dto'
import { StockRepository } from '../entities/repositories/stock.repository'
import { GenerateTemplateEditStock } from './generate_template_stock'

export class CreateInitialStock {
  constructor(
    private readonly generateEditableTemplate: GenerateTemplateEditStock,
    private readonly stockRepository: StockRepository,
  ) {}

  async run({ items, stockAt, storeCode }: CreateInitialStockDto) {
    await this.validate(storeCode)
    this.validateItems(items)

    const editTemplate = await this.generateEditableTemplate.run(
      storeCode,
      stockAt,
    )

    const itemsToCreate: StockItemToCreateDto[] = []
    for (const itemTemplate of editTemplate) {
      const itemEdited = items.find((el) => el.itemId == itemTemplate.itemId)
      if (itemEdited) {
        itemsToCreate.push({
          ...itemTemplate,
          initialStock: itemEdited.initialStock,
          totalInitial: itemTemplate.unitValue * itemEdited.initialStock,
        })
      }
    }

    await this.stockRepository.saveStock(itemsToCreate, stockAt, storeCode)
  }

  private validateItems(items: CreateInitialStockDto['items']) {
    if (items.length == 0) throw new Error('No se puede crear un stock vacio')
    if (items.every((el) => el.initialStock == 0))
      throw new Error(
        'No se puede crear un stock inicial con todas las cantidades 0',
      )
  }

  private async validate(sucursalCode: string) {
    const lastCloseDate =
      await this.stockRepository.getLastClosedDate(sucursalCode)
    if (lastCloseDate)
      throw new Error(
        'Ya existe un stock cerrado, no puedes genear un inventario inicial',
      )
  }
}
