import { SyncProductWithSizesAndFlavorsDto } from "../../shared/dtos/Catalog.dto"
import { buildMenuProdId } from "./helpers"

export const buildSyncPayload = (
  rawProducts: SyncProductWithSizesAndFlavorsDto[]
): SyncProductWithSizesAndFlavorsDto[] => {
  return rawProducts.map(buildSingleSyncPayload)
}

export const buildSingleSyncPayload = (
  p: SyncProductWithSizesAndFlavorsDto
): SyncProductWithSizesAndFlavorsDto => {
  const flavor = p.flavors?.[0]
  const size = p.sizes?.[0]

  const baseId = p.product.id ?? p.product.menuprod_id // usar siempre el id base
  const menuprod_id = buildMenuProdId(
    baseId,
    flavor?.menuflav_id,
    size?.menusize_id
  )
  console.log('✅ menuprod_id generado:', menuprod_id)

  return {
    product: {
      ...p.product,
      product: `${p.product.product} ${flavor?.flavor ?? ''}`.trim(),
      menuprod_id
    },
    flavors: p.flavors,
    sizes: p.sizes
  }
}
