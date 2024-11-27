import { Size } from './product_size'

type ProductId = number
type ItemId = number
export const equivalencia: Record<ProductId, Partial<Record<Size, ItemId>>> = {
  // 2: {
  //   [Size.FAMILIAR]: 53,
  // },
}
