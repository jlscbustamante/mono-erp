// utils/catalog/helpers.ts
export const buildMenuProdId = (
    baseId: number,
    flavorId?: number,
    sizeId?: number
  ): number => {
    return parseInt(`${baseId}${flavorId ?? 0}${sizeId ?? 0}`)
  }
  