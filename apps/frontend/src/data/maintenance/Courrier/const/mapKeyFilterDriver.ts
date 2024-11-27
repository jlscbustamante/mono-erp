import { OpFilter } from '@/data/types/Filters'

import { ICourrier } from '../type/Courrier'

export const mapKeyFilterCourrier = (key: keyof ICourrier): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'email':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'doc_number':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'doc_type':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'stores':
      return [OpFilter.Select]
    case 'shift_hired':
      return [OpFilter.Select]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validCourrier = () => {
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
      key: 'email',
      label: 'Correo',
    },
    {
      key: 'phone',
      label: 'Teléfono',
    },
    {
      key: 'doc_type',
      label: 'Tipo de doc',
    },
    {
      key: 'doc_number',
      label: 'N° de doc',
    },
    {
      key: 'stores',
      label: 'Tienda',
    },
    {
      key: 'shift_hired',
      label: 'Turno',
    },

    {
      key: 'status',
      label: 'Estado',
    },
  ]
}
