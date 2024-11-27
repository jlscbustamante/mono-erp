import { Equivalence } from './equivalence'
import { Item } from './item'

export class TemplateItem {
  public readonly itemDispatchId: number
  public readonly itemStockId: number
  constructor(
    private readonly itemDispatch: Item,
    private readonly itemStock: Item,
    public equivalence: Equivalence | null,
  ) {
    this.itemDispatchId = itemDispatch.id
    this.itemStockId = itemStock.id
  }

  getItemDispatch() {
    return this.itemDispatch
  }
  getItemStock() {
    return this.itemStock
  }

  getStockQuantity(quantity: number) {
    if (!this.equivalence) return quantity
    return this.equivalence.getValue(quantity)
  }

  /**
   *
   * @description Convierte la cantidad del stock a la cantidad de despacho
   */
  getDispatchQuantity(quantity: number) {
    if (!this.equivalence) return quantity
    return this.equivalence.reverseGetValue(quantity)
  }
}
