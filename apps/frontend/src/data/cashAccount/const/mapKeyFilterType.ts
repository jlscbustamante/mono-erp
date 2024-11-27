import { OpFilter } from '@/data/types/Filters'

import { ITypeCashAccount } from '../types/cashTypes'

export const mapKeyFiltertype = (key: keyof ITypeCashAccount): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'name':
      return [OpFilter.Equal]
    case 'type_id':
      return [OpFilter.Equal]
    case 'status':
      return [OpFilter.Select]
    default:
      return [OpFilter.Equal]
  }
}
const _op = {
  id: {
    key: 'id',
    label: 'ID',
  },
  name: {
    key: 'name',
    label: 'Nombre',
  },
  type_id: {
    key: 'type_id',
    label: 'Tipo ID',
  },
  styatus: {
    key: 'status',
    label: 'Estado',
  },
}
export const validCashAccountType = () => {
  return [_op.id, _op.name, _op.type_id, _op.styatus]
}
