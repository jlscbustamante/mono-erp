import { Filters, OpFilter } from '../Filters'
import { safeAny } from '../someAny'

import { InvRecipeFilter } from '../shared-types'

export const transformFilterToValid = (
  filters: Filters<InvRecipeFilter>,
): Filters<InvRecipeFilter> => {
  const validFilters: Filters<InvRecipeFilter> = {}
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof InvRecipeFilter
    const valuenotundefined: [OpFilter, ...safeAny[]] = value.filter(
      (v) => v !== undefined,
    ) as [OpFilter, ...safeAny[]]
    if (valuenotundefined.length <= 1) continue

    if (value[0] == OpFilter.Select)
      validFilters[tkey] = [OpFilter.Equal, valuenotundefined[1]]
    else if (value[0] == OpFilter.SelectIn)
      validFilters[tkey] = [OpFilter.In, ...valuenotundefined.slice(1)]
    else validFilters[tkey] = valuenotundefined
  }

  return validFilters
}
export const transformFilterToValidRecipe = (
  filters: Filters<InvRecipeFilter>,
): Filters<InvRecipeFilter> => {
  const validFilters: Filters<InvRecipeFilter> = {}
  //console.log('filtro : ')
  //console.table(filters)
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof InvRecipeFilter
    const valuenotundefined: [OpFilter, ...safeAny[]] = value.filter(
      (v) => v !== undefined,
    ) as [OpFilter, ...safeAny[]]
    if (valuenotundefined.length <= 1) continue

    if (value[0] == OpFilter.Select)
      validFilters[tkey] = [OpFilter.Equal, valuenotundefined[1]]
    else if (value[0] == OpFilter.SelectIn)
      validFilters[tkey] = [OpFilter.In, ...valuenotundefined.slice(1)]
    else validFilters[tkey] = valuenotundefined
  }

  return validFilters
}
