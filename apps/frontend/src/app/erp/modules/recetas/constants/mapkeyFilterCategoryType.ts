import { OpFilter } from '@/data/types/Filters'

export const mapKeyFilterType = (key: keyof any): OpFilter[] => {
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
