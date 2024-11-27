import { OpFilter } from '@/data/types/Filters'

import { ICostCenter } from '../type/CostCenter'

export const mapKeyFilterCostCenter = (key: keyof ICostCenter): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'origin':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'account_caja':
      return [OpFilter.Equal]
    case 'account_ajuste':
      return [OpFilter.Equal]
    case 'account_merca':
      return [OpFilter.Equal]
    case 'is_cash':
      return [OpFilter.Select]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validCostCenter = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'origin',
      label: 'Centro de costo',
    },
    {
      key: 'account_caja',
      label: 'C.c de tienda',
    },
    {
      key: 'account_ajuste',
      label: 'C.c de ajuste',
    },
    {
      key: 'account_merca',
      label: 'C.c de mercaderia',
    },
    {
      key: 'is_cash',
      label: '¿Es tienda?',
    },
    {
      key: 'created_at',
      label: 'Fecha de creacion',
    },
    {
      key: 'status',
      label: 'Estado',
    },
  ]
}
