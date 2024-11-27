import { OpFilter } from '@/data/types/Filters'

import { IBankReconciliation } from '../types'

export const validFieldsForFilter = (): {
  key: keyof IBankReconciliation
  label: string
}[] => {
  return [
    {
      key: 'bnk_amount',
      label: 'Monto',
    },
    {
      key: 'bnk_date',
      label: 'Fecha',
    },
    {
      key: 'req_id',
      label: 'Requerimiento',
    },
  ]
}

export const getFilterTypesForKey = (
  key: keyof IBankReconciliation,
): OpFilter[] => {
  switch (key) {
    case 'req_id':
      return [OpFilter.Equal, OpFilter.IsNull, OpFilter.NotNull]
    case 'bnk_amount':
      return [OpFilter.Equal, OpFilter.Range]
    case 'bnk_date':
      return [
        OpFilter.EqualDate,
        OpFilter.RangeDate,
        OpFilter.lastMonth,
        OpFilter.lastWeek,
      ]
    default:
      return [OpFilter.Equal]
  }
}
