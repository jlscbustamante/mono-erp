import { IRequest, RequestTypeCategory } from '@/data/requests/types'
import { Filters, OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

export const transformFilterToValid = (
  filters: Filters<IRequest>,
): Filters<IRequest> => {
  const validFilters: Filters<IRequest> = {}
  for (const [key, value] of Object.entries(filters)) {
    const tkey = key as keyof IRequest
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
  const newLocal = 'category_id_cash' as keyof IRequest
  if (validFilters[newLocal]) {
    delete validFilters['category_id']
    validFilters['category_id'] = validFilters[newLocal]
    validFilters['category_move'] = [OpFilter.Equal, RequestTypeCategory.Cash]
    delete validFilters[newLocal]
  }
  return validFilters
}
