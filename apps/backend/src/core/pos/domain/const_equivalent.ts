// LISTA DE EQUIVALENCIA HARDCODEADA

import { equivalencia } from './file_const'
import { Size } from './product_size'

export const getEquivalentItem = (
  productId: number,
  size: Size,
): number | null => {
  return equivalencia[productId]?.[size] ?? null
}

export const getEquivalences = (productIds: number[]): number[] => {
  const itemIds: number[] = []
  for (const productId of productIds) {
    const equivalences = equivalencia[productId]
    if (!equivalences) continue
    const ids = Object.values(equivalences)
    itemIds.push(...ids)
  }
  return itemIds
}
