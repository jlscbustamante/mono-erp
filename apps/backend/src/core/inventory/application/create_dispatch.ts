import { DispatchCreateDto, StockItemToCreateDto } from '../dto'
import { STOCK_STATUS } from '../entities'
import { DISPATCH_STATUS } from '../entities/dispatch'
import { DispatchRepository } from '../entities/repositories/dispatch.repository'
import { TemplateRepository } from '../entities/repositories/template.repository'
import { WarehousesRepository } from '../entities/repositories/warehouses.repository'
import { Template } from '../entities/template'
import { calculateCurrent } from '../entities/util'
import { GenerateTemplateEditStock } from './generate_template_stock'
import { SaveBiStock } from './save_bi_stock'

export class CreateDispatch {
  constructor(
    private readonly saveBiStock: SaveBiStock,
    private readonly templateRepository: TemplateRepository,
    private readonly dispatchRepository: DispatchRepository,
    private readonly warehouseRepository: WarehousesRepository,
    private readonly generateTemplateEditStock: GenerateTemplateEditStock,
  ) {}

  async run(
    dispatch: DispatchCreateDto,
    status: DISPATCH_STATUS,
    user = 'sys',
  ) {
    this.validateDispatch(dispatch)
    await this.saveBiStock.validate(dispatch.dispatchAt, [
      dispatch.wareFromId,
      dispatch.wareToId,
    ])
    const { templateFrom, templateTo } = await this.getTemplates(dispatch)
    this.validateTemplates(dispatch, { from: templateFrom, to: templateTo })
    if (status === DISPATCH_STATUS.DISPATCHED) {
      await this.saveDispatchAndDispatch(
        {
          ...dispatch,
          status,
        },
        { from: templateFrom, to: templateTo },
        user,
      )
    } else {
      await this.saveDispatch(dispatch, user)
    }
  }

  async createException(dispatch: DispatchCreateDto, user = 'sys') {
    this.validateDispatch(dispatch)
    const { templateFrom, templateTo } = await this.getTemplates(dispatch)

    this.validateTemplates(dispatch, { from: templateFrom, to: templateTo })

    await this.saveDispatchAndDispatch(
      {
        ...dispatch,
        status: DISPATCH_STATUS.DISPATCHED,
      },
      { from: templateFrom, to: templateTo },
      user,
    )
  }

  private async saveDispatchAndDispatch(
    dispatch: DispatchCreateDto,
    { from, to }: { from: Template; to: Template },
    user?: string,
  ) {
    const date = dispatch.dispatchAt
    const warehouseFrom = dispatch.wareFromId
    const warehouseTo = dispatch.wareToId

    const items = dispatch.items

    const [fromIsWarehouse, toIsWarehouse] = await Promise.all([
      this.warehouseRepository.isWarehouse(warehouseFrom),
      this.warehouseRepository.isWarehouse(warehouseTo),
    ])
    let [baseFrom, baseTo]: [StockItemToCreateDto[], StockItemToCreateDto[]] =
      await Promise.all([
        this.generateTemplateEditStock.run(warehouseFrom, date),
        this.generateTemplateEditStock.run(warehouseTo, date),
      ])

    for (const item of items) {
      // salida
      const itemOutInPlantilla = from.items.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemOutInPlantilla) {
        const stockItem = itemOutInPlantilla.getItemStock()
        const stockQuantity = itemOutInPlantilla.getStockQuantity(item.quantity)
        baseFrom = baseFrom.map((el) => {
          if (el.itemId == stockItem.id) {
            const stockCurrent =
              calculateCurrent(fromIsWarehouse, {
                initialStock: el.initialStock,
                quantityInDispatch: el.quantityInDispatch,
                quantityInMv: el.quantityInMv,
                quantityInPurchase: el.quantityInPurchase,
                quantityOutDispatch: el.quantityOutDispatch,
                quantityOutMv: el.quantityOutMv,
              }) - stockQuantity

            const newStockItem: StockItemToCreateDto = {
              ...el,
              stockCurrent,
              createdBy: user ?? el.createdBy,
            }
            if (fromIsWarehouse) {
              newStockItem.quantityOutDispatch =
                newStockItem.quantityOutDispatch + stockQuantity
            } else {
              newStockItem.quantityOutMv =
                newStockItem.quantityOutMv + stockQuantity
            }

            return newStockItem
          }
          return el
        })
      }
    }
    for (const item of items) {
      // entrada
      const itemInInPlantilla = to.items.find(
        (el) => el.itemDispatchId == item.itemId,
      )
      if (itemInInPlantilla) {
        const stockItem = itemInInPlantilla.getItemStock()
        const stockQuantity = itemInInPlantilla.getStockQuantity(item.quantity)
        baseTo = baseTo.map((el) => {
          if (el.itemId == stockItem.id) {
            const stockCurrent =
              calculateCurrent(toIsWarehouse, {
                initialStock: el.initialStock,
                quantityInDispatch: el.quantityInDispatch,
                quantityInMv: el.quantityInMv,
                quantityInPurchase: el.quantityInPurchase,
                quantityOutDispatch: el.quantityOutDispatch,
                quantityOutMv: el.quantityOutMv,
              }) + stockQuantity

            // NOTA: no hay despacho hacia almacen, el receptor siempre sera una tienda
            const newStockItem: StockItemToCreateDto = {
              ...el,
              stockCurrent,
              createdBy: user ?? el.createdBy,
            }
            // solo hay que ver de quien viene el depacho
            if (fromIsWarehouse) {
              newStockItem.quantityInDispatch =
                newStockItem.quantityInDispatch + stockQuantity
            } else {
              newStockItem.quantityInMv =
                newStockItem.quantityInMv + stockQuantity
            }
            return newStockItem
          }
          return el
        })
      }
    }

    baseFrom = baseFrom.map((el) => ({
      ...el,
      status: STOCK_STATUS.AUTOGENERATED,
    }))
    baseTo = baseTo.map((el) => ({
      ...el,
      status: STOCK_STATUS.AUTOGENERATED,
    }))

    await this.dispatchRepository.createDispatch(dispatch)
    await this.saveBiStock.run(baseFrom, baseTo, date, [
      warehouseFrom,
      warehouseTo,
    ])
  }

  private async saveDispatch(
    dispatch: DispatchCreateDto,
    user?: string,
  ): Promise<number> {
    return this.dispatchRepository.createDispatch(dispatch, user)
  }
  private async getTemplates(dispatch: DispatchCreateDto) {
    const [from, to] = await Promise.all([
      this.templateRepository.getDynamicTemplate(dispatch.wareFromId),
      this.templateRepository.getDynamicTemplate(dispatch.wareToId),
    ])
    return { templateFrom: from, templateTo: to }
  }

  private validateDispatch(dispatch: DispatchCreateDto) {
    if (!dispatch.wareFromId || dispatch.wareFromId == '') {
      throw new Error('Completa el Origen del despacho')
    }
    if (!dispatch.wareToId || dispatch.wareToId == '') {
      throw new Error('Completa el Destino del despacho')
    }
    if (dispatch.items.length == 0) {
      throw new Error('No se puede crear un despacho sin items')
    } else if (dispatch.items.some((el) => el.quantity == 0)) {
      throw new Error('El despacho tiene items con cantidades 0, eliminelos')
    }
    if (!dispatch.dispatchAt) {
      throw new Error('Completa la fecha del despacho')
    }
  }

  private validateTemplates(
    dispatch: DispatchCreateDto,
    { from, to }: { from: Template; to: Template },
  ) {
    const items = dispatch.items
    for (const item of items) {
      const fromItem = from.items.find((el) => el.itemDispatchId == item.itemId)
      const toItem = to.items.find((el) => el.itemDispatchId == item.itemId)
      if (!fromItem || !toItem)
        throw new Error(
          `No se encontro el item ${item.itemName} en la plantilla.`,
        )
    }
  }
}
