import { ItemRelation } from './item_relation.interface'

export interface RelationsRepository {
  getEfisItemsOrThrow(ids: number[]): Promise<ItemRelation[]>
  getEfisItems(ids: number[]): Promise<ItemRelation[]>
}
