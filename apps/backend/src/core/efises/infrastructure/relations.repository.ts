import { ItemRelation } from '../entities'
import { RelationsRepository } from '../entities/relations.repository'
import { RELATIONS_ITEMS } from '../moch/relations_items'

export class RelationsRepositoryImpl implements RelationsRepository {
  private dbItems = RELATIONS_ITEMS

  async getEfisItems(ids: number[]): Promise<ItemRelation[]> {
    const items = this.dbItems.filter((el) => ids.includes(el.itemId))
    return Promise.resolve(items)
  }

  async getEfisItemsOrThrow(ids: number[]): Promise<ItemRelation[]> {
    const items = await this.getEfisItems(ids)
    ids.forEach((id) => {
      if (!items.find((el) => el.itemId == id)) {
        throw new Error('Item no encontrado')
      }
    })

    return Promise.resolve(items)
  }
}
