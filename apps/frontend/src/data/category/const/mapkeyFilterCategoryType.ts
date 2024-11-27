import { OpFilter } from '@/data/types/Filters'

import { ITypeCategory } from '../types'

export const mapKeyFilterType = (key: keyof ITypeCategory): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'type_id':
      return [OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    default:
      return [OpFilter.Equal]
  }
}
export const validTypeCategory = () => {
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
      key: 'type_id',
      label: 'Tipo ID',
    },
    {
      key: 'status',
      label: 'Estado',
    },
  ]
}
