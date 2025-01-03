import { OpFilter } from '@/data/types/Filters'

import { IIamUser } from '../type/IamUser'

export const mapKeyFilterIamUser = (key: keyof IIamUser): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Equal, OpFilter.Contain]
    case 'email':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validIIamUser = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    // {
    //   key: 'name',
    //   label: 'Nombre',
    // },
    {
      key: 'email',
      label: 'Email',
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
