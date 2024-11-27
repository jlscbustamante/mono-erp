import { OpFilter } from '@/data/types/Filters'

import { ICashAccount } from '../types'

export const mapKeyFilter = (key: keyof ICashAccount): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'account_id':
      return [OpFilter.Contain, OpFilter.Equal]
    case 'type_cash_id':
      return [OpFilter.Equal]
    case 'codefis':
      return [OpFilter.Equal]
    case 'roles_id':
      return [OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    default:
      return [OpFilter.Equal]
  }
}

const _op = {
  id: {
    key: 'id',
    label: 'id',
  },
  name: {
    key: 'name',
    label: 'Nombre',
  },
  account_id: {
    key: 'account_id',
    label: 'Cuenta',
  },
  type_cash_id: {
    key: 'type_cash_id',
    label: 'Tipo de caja',
  },
  status: {
    key: 'status',
    label: 'Estado',
  },
  created_at: {
    key: 'created_at',
    label: 'Fecha de creacion',
  },
}

export const validCashAccount = () => {
  return [
    _op.id,
    _op.name,
    _op.account_id,
    _op.type_cash_id,
    _op.status,
    _op.created_at,
  ]
}
