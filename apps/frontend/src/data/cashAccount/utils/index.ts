import { Filters, OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { ICashAccount } from '../types'
import { ITypeCashAccount } from '../types/cashTypes'

export const transformFilterToValid = (
  filters: Filters<ICashAccount>,
): Filters<ICashAccount> => {
  const validFilters: Filters<ICashAccount> = {}
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof ICashAccount
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

export const transformFilterToValidType = (
  filters: Filters<ITypeCashAccount>,
): Filters<ITypeCashAccount> => {
  const validFilters: Filters<ITypeCashAccount> = {}
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof ITypeCashAccount
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
