import { format } from 'date-fns'

import { kardexService } from '../../common/instances'
import { DispatchUpdateDto, StockItemToCreateDto } from '../dto'
import { DISPATCH_STATUS } from '../entities/dispatch'
import { DispatchRepository } from '../entities/repositories/dispatch.repository'
import { TemplateRepository } from '../entities/repositories/template.repository'
import { WarehousesRepository } from '../entities/repositories/warehouses.repository'
import { Template } from '../entities/template'
import { calculateCurrent } from '../entities/util'
import { GenerateTemplateEditStock } from './generate_template_stock'
import { SaveBiStock } from './save_bi_stock'

export class DispatchItems {
  constructor(
    private generateTemplateEditStock: GenerateTemplateEditStock,
    private saveBiStock: SaveBiStock,
    private readonly templateRepository: TemplateRepository,
    private readonly dispatchRepository: DispatchRepository,
    private readonly warehouseRepository: WarehousesRepository,
  ) {}

  async run(dispatch: DispatchUpdateDto, user?: string) {
    this.validateDataDispatch(dispatch)
    this.validateDateDispatch(dispatch)

    // validate guardadod de stock antes de iniciar
    await this.saveBiStock.validate(dispatch.dispatchAt, [
      dispatch.wareFromId,
      dispatch.wareToId,
    ])
    const { templateFrom, templateTo } = await this.getTemplates(dispatch)
    this.validateTemplates(dispatch, { from: templateFrom, to: templateTo })
    await this.saveDispatch(
      dispatch,
      { from: templateFrom, to: templateTo },
      user,
    )
    await kardexService.generateFromDispatch(dispatch.id, user ?? 'sys')
    // await kardexService.generateFromDispatch(dispatch.id, user ?? 'sys')
  }

  async runWithoutValidate(dispatch: DispatchUpdateDto, user?: string) {
    this.validateDataDispatch(dispatch)
    this.validateDateDispatch(dispatch)

    // await this.saveBiStock.validate(dispatch.dispatchAt, [
    //   dispatch.wareFromId,
    //   dispatch.wareToId,
    // ])
    const { templateFrom, templateTo } = await this.getTemplates(dispatch)
    this.validateTemplates(dispatch, { from: templateFrom, to: templateTo })
    await this.saveDispatch(
      dispatch,
      { from: templateFrom, to: templateTo },
      user,
    )
    // await kardexService.generateFromDispatch(dispatch.id, user ?? 'sys')
  }

  private async saveDispatch(
    dispatch: DispatchUpdateDto,
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

    await this.dispatchRepository.saveDispatch(dispatch)
    await this.saveBiStock.run(baseFrom, baseTo, date, [
      warehouseFrom,
      warehouseTo,
    ])
    await this.dispatchRepository.changeStatus(
      dispatch.id,
      DISPATCH_STATUS.DISPATCHED,
    )
  }

  private validateTemplates(
    dispatch: DispatchUpdateDto,
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

  private validateDateDispatch(dispatch: DispatchUpdateDto) {
    // validaciones  si es necsario para el despacho
    // no se agrego, xq hya se hace al guardar inventario

    const today = format(new Date(), 'yyyy-MM-dd')
    const dispatchDate = dispatch.dispatchAt?.split(' ')[0]
    if (dispatchDate > today)
      throw new Error('La fecha de despacho no puede ser mayor a hoy')
  }

  private async getTemplates(dispatch: DispatchUpdateDto) {
    const [from, to] = await Promise.all([
      this.templateRepository.getDynamicTemplate(dispatch.wareFromId),
      this.templateRepository.getDynamicTemplate(dispatch.wareToId),
    ])
    return { templateFrom: from, templateTo: to }
  }

  private validateDataDispatch(dispatch: DispatchUpdateDto) {
    // que no sea 0 los items
    if (dispatch.items.length === 0)
      throw new Error('No se puede almacenar un despacho sin items')
    // que no se repitan items
    const itemIds = dispatch.items.map((el) => el.itemId)
    if (new Set(itemIds).size !== itemIds.length)
      throw new Error('No se puede almacenar un despacho con items repetidos')
    // que exista el item
    if (!dispatch.wareFromId || !dispatch.wareToId)
      throw new Error('Completa los datos del despacho, origen y destino')
    if (!dispatch.dispatchAt) throw new Error('Completa la fecha del despacho')

    for (const item of dispatch.items) {
      if (!item.measureId)
        throw new Error(`No se encontro la U.M del item ${item.itemName}`)
      if (!item.presentationName)
        throw new Error(
          `No se encontro el nombre presentación del item ${item.itemName}`,
        )
    }
  }
}
