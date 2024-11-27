import { IParameter } from '@/data/maintenance/Parameters/type/Parameters'
import { OpFilter } from '@/data/types/Filters'

export const mapKeyFilterParameter = (key: keyof IParameter): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'type':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'value':
      return [OpFilter.Equal]
    case 'role':
      return [OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validParameters = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'type',
      label: 'Tipo',
    },
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'value',
      label: 'Valor',
    },
    {
      key: 'role',
      label: 'Rol',
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
