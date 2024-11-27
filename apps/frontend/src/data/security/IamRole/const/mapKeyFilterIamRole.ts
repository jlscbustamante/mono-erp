import { OpFilter } from '@/data/types/Filters'

import { IIamRole } from '../type/IamRole'

export const mapKeyFilterIamRole = (key: keyof IIamRole): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Equal, OpFilter.Contain]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validIIamRole = () => {
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
      key: 'status',
      label: 'Estado',
    },
    {
      key: 'created_at',
      label: 'Fecha de creacion',
    },
  ]
}
