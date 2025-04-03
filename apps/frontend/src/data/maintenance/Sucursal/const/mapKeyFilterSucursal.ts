import { OpFilter } from '@/data/types/Filters'

import { ISucursal } from '../type/Sucursal'

export const mapKeyFilterSucursal = (key: keyof ISucursal): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Contain, OpFilter.Equal, OpFilter.NotEqual]
    case 'status':
      return [OpFilter.Select]
    case 'title':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'ubi_address':
      return [OpFilter.Equal]
    case 'ubi_district':
      return [OpFilter.Equal]
    case 'ubi_city':
      return [OpFilter.Equal]
    case 'type_sede':
      return [OpFilter.Equal]
    case 'legalperson_name':
      return [OpFilter.Equal]
    case 'legalperson_docnum':
      return [OpFilter.Equal]
    case 'legalperson_doctype':
      return [OpFilter.Equal]
    case 'legalperson_account_bco':
      return [OpFilter.Equal]
    case 'legalperson_account_num':
      return [OpFilter.Equal]
    case 'legalperson_account_cci':
      return [OpFilter.Equal]
    case 'legalperson_account_cur':
      return [OpFilter.Equal]
    case 'legalperson_account_type':
      return [OpFilter.Equal]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}
export const validSucursal = () => {
  return [
    {
      key: 'id',
      label: 'ID',
    },

    {
      key: 'title',
      label: 'Tienda',
    },

    {
      key: 'ubi_address',
      label: 'Direccion',
    },
    {
      key: 'ubi_district',
      label: 'Distrito',
    },

    {
      key: 'ubi_city',
      label: 'Cuidad',
    },
    {
      key: 'type_sede',
      label: 'Tipo de tienda',
    },

    {
      key: 'legalperson_name',
      label: 'Persona contrato',
    },
    {
      key: 'legalperson_docnum',
      label: 'Documento',
    },
    {
      key: 'legalperson_doctype',
      label: 'Tipo documento',
    },
    {
      key: 'legalperson_account_bco',
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
