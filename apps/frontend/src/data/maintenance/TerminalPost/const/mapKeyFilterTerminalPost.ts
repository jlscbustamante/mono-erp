import { OpFilter } from '@/data/types/Filters'

import { ITerminalPost } from '../type/TerminalPost'

export const mapKeyFilterTerminalPost = (
  key: keyof ITerminalPost,
): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'terminal':
      return [OpFilter.Equal, OpFilter.Contain]
    case 'sucursal_id':
      return [OpFilter.Select]
    case 'supplier':
      return [OpFilter.Select]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validTerminalPost = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'terminal',
      label: 'Terminal',
    },
    {
      key: 'sucursal_id',
      label: 'Tienda',
    },
    {
      key: 'supplier',
      label: 'Proveedor',
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
