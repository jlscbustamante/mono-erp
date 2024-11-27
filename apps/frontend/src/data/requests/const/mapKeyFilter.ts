import { OpFilter } from '@/data/types/Filters'
import { safeAny } from '@/utils'

import { IRequest } from '../types'

export const getFilterTypesForKey = (key: keyof IRequest): OpFilter[] => {
  switch (key) {
    case 'id':
      return [OpFilter.Equal, OpFilter.NotEqual]
    case 'description':
    case 'legal_number':
    case 'num_document':
    case 'legal_name':
      return [OpFilter.Contain, OpFilter.Equal, OpFilter.NotEqual]
    case 'created_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    case 'amount_net':
    case 'amount_ret':
    case 'amount':
      return [OpFilter.Equal, OpFilter.NotEqual, OpFilter.Range]
    case 'category_id_cash' as safeAny:
    case 'category_id':
    case 'cash_id':
      return [OpFilter.Select, OpFilter.SelectIn]
    case 'approved_by':
    case 'created_by':
    case 'rejected_by':
      return [OpFilter.Contain, OpFilter.Equal, OpFilter.NotEqual]
    case 'approved_at':
    case 'requested_at':
    case 'rejected_at':
      return [OpFilter.EqualDate, OpFilter.RangeDate]
    case 'cost_center_id':
      return [OpFilter.Select, OpFilter.SelectIn]
    default:
      return [OpFilter.Equal]
  }
}

const _op = {
  id: {
    key: 'id',
    label: 'id',
  },
  description: {
    key: 'description',
    label: 'Descripcion',
  },
  amount: {
    key: 'amount',
    label: 'Monto',
  },
  category_id: {
    key: 'category_id',
    label: 'Categorias',
  },
  category_id_cash: {
    key: 'category_id_cash',
    label: 'Caja origen',
  },
  cash_id: {
    key: 'cash_id',
    label: 'Caja',
  },
  legal_name: {
    key: 'legal_name',
    label: 'Proveedor',
  },
  num_document: {
    key: 'num_document',
    label: 'N° doc.',
  },

  created_by: {
    key: 'created_by',
    label: 'Creado por',
  },
  approved_by: {
    key: 'approved_by',
    label: 'Aprobado por',
  },
  requested_at: {
    key: 'requested_at',
    label: 'Fecha de solicitud',
  },
  approved_at: {
    key: 'approved_at',
    label: 'Fecha de aprobación',
  },

  created_at: {
    key: 'created_at',
    label: 'Fecha creación',
  },
  rejected_by: {
    key: 'rejected_by',
    label: 'Rechazado por',
  },
  costCenterId: {
    key: 'cost_center_id',
    label: 'Centro de costo',
  },
}

export const validFieldsOptionsBanckFix = () => {
  return [
    _op.id,
    _op.description,
    _op.amount,
    _op.category_id,
    // _op.category_id_cash,
    _op.cash_id,
    _op.legal_name,
    _op.num_document,
    _op.created_by,
    // _op.created_at,
    _op.approved_at,
  ]
}

export const validFieldsOptionsPending = () => {
  return [
    _op.id,
    _op.description,
    _op.amount,
    _op.category_id,
    // _op.category_id_cash,
    _op.cash_id,
    _op.costCenterId,
    _op.legal_name,
    _op.num_document,
    _op.created_by,
  ]
}

export const validFieldsOptionsApproved = () => {
  return [
    _op.id,
    _op.description,
    _op.amount,
    _op.category_id,
    // _op.category_id_cash,
    _op.cash_id,
    _op.costCenterId,
    _op.legal_name,
    _op.num_document,
    _op.created_by,
    _op.approved_by,
    // _op.created_at,
  ]
}

export const validFieldsOptionsRejected = () => {
  return [
    _op.id,
    _op.description,
    _op.amount,
    _op.category_id,
    // _op.category_id_cash,
    _op.cash_id,
    _op.legal_name,
    _op.num_document,
    _op.created_by,
    _op.rejected_by,
    _op.created_at,
  ]
}
