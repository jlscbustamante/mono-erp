import { Dispatch, DISPATCH_STATUS } from '../../inventory/entities/dispatch'
import { DispatchRepository } from '../../inventory/entities/repositories/dispatch.repository'
import { WarehousesRepository } from '../../inventory/entities/repositories/warehouses.repository'
import { ItemEfis, ItemRelation } from '../entities'
import { RelationsRepository } from '../entities/relations.repository'

export class SendDispatch {
  constructor(
    private readonly dispatchRepository: DispatchRepository,
    private readonly relationsRepository: RelationsRepository,
    private readonly warehouseRepository: WarehousesRepository,
  ) {}

  async run(dispatchId: number) {
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('Despacho no encontrado')
    const warehouse = await this.warehouseRepository.getWarehouse(
      dispatch.wareToId,
    )
    if (!warehouse) throw new Error('Tienda no encontrada')
    if (dispatch.status !== DISPATCH_STATUS.DISPATCHED) {
      throw new Error(
        'No se puede enviar un despacho que no ha sido despachado',
      )
    }
    const relationsArray = await this.relationsRepository.getEfisItems(
      dispatch.items.map((el) => el.itemId),
    )
    const relations = this.validateRelations(dispatch, relationsArray)
    const itemsToSave = dispatch.items.map((el) => {
      const rel = relations[el.itemId]
      if (!rel)
        throw new Error('No se encontro la relacion del item ' + el.itemName)
      const dispatchAt = dispatch.dispatchAt?.split(' ')[0]
      return {
        tien_cod: warehouse.code,
        fecha: dispatchAt,
        codigo: rel.id,
        costo: rel.price,
        factor: rel.measure.factor,
        peso: rel.measure.factor,
        unid_cod: rel.unitMeasureCode,
        numero: dispatch.id,
        importe: 0,
        item: 0,
      } satisfies ItemEfis
    })

    return itemsToSave
  }

  private validateRelations(
    dispatch: Dispatch,
    items: ItemRelation[],
  ): Record<number, ItemRelation> {
    const relations: Record<number, ItemRelation> = {}
    const itemsNotFounded: string[] = []
    for (const item of dispatch.items) {
      const relation = items.find((el) => el.itemId == item.itemId)
      if (!relation) {
        itemsNotFounded.push(item.id + ' - ' + item.itemName)
      } else {
        relations[item.itemId] = relation
      }
    }

    if (itemsNotFounded.length > 0) {
      throw new Error(
        `Items no encontrados en la relacion con efisis: ${itemsNotFounded.join(
          ', ',
        )}`,
      )
    }
    return relations
  }
}
