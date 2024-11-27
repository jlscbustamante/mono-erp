import { OpFilter } from '@/data/types/Filters'

import { ISupplier } from '../type/Supplier'

export const mapKeyFilterSupplier = (key: keyof ISupplier): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'supplier':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'legal_name':
      return [OpFilter.Equal]
    case 'legal_number':
      return [OpFilter.Equal]
    case 'address':
      return [OpFilter.Equal]
    case 'legal_account_bco':
      return [OpFilter.Equal]
    case 'legal_account_num':
      return [OpFilter.Equal]
    case 'legal_account_cci':
      return [OpFilter.Equal]
    case 'legal_account_cur':
      return [OpFilter.Equal]
    case 'legal_account_type':
      return [OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validSupplier = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'supplier',
      label: 'Proveedor',
    },
    {
      key: 'legal_name',
      label: 'Nombre',
    },
    {
      key: 'legal_number',
      label: 'RUC',
    },
    {
      key: 'address',
      label: 'Direccion',
    },
    {
      key: 'legal_account_bco',
      label: 'Banco',
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
