import { Filters, OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { ISupplier } from '../type/Supplier'

export const transformFilterToValid = (
  filters: Filters<ISupplier>,
): Filters<ISupplier> => {
  const validFilters: Filters<ISupplier> = {}
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof ISupplier
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
