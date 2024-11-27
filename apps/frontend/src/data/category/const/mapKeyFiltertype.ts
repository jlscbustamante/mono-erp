import { OpFilter } from '@/data/types/Filters'

import { ICategory } from '../types'

export const mapKeyFilterCategory = (key: keyof ICategory): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    case 'account_id':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'type_category_id':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'cash_flow':
      return [OpFilter.Equal]
    case 'account_flow':
      return [OpFilter.Select]
    case 'type_mov':
      return [OpFilter.Select]
    case 'roles_id':
      return [OpFilter.Equal]
    case 'm_order':
      return [OpFilter.Equal]
    case 'codEfis':
      return [OpFilter.Equal]
    default:
      return [OpFilter.Equal]
  }
}
export const validCategory = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'account_id',
      label: 'Cuenta',
    },
    {
      key: 'type_category_id',
      label: 'Tipo de categoria',
    },
    {
      key: 'account_flow',
      label: 'Flujo de cuenta',
    },
    {
      key: 'type_mov',
      label: 'Tipo de movimiento',
    },
    {
      key: 'status',
      label: 'Estado',
    },
  ]
}
