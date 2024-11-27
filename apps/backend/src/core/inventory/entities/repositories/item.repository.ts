import { Item } from '../item'

export interface ItemRepository {
  getItems(ids: number[]): Promise<Item[]>
  getAllItems(): Promise<Item[]>
  getActiveItems(): Promise<Item[]>
}
