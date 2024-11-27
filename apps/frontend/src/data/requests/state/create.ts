import { atom, RecoilState, selector } from 'recoil'

import { AccountFlow } from '@/data/types/accountFlow'

import { IRequest, RequestType, RequestTypeCategory, Retention } from '../types'

export const defaultSimpleForm: Partial<IRequest> = {
  request_type: RequestType.Simple,
  num_document: '',
  legal_name: '',
  legal_number: '',
  description: '',
  amount: 1,
  category_id: null,
  category_move: RequestTypeCategory.Category,
  cash_id: null,
  cost_center_id: null,
  retention: Retention.No,
  amount_net: null,
  amount_ret: null,
}
export const defaultLiquidationForm: Partial<IRequest> = {
  request_type: RequestType.Liquidation,
  num_document: '',
  legal_name: '',
  legal_number: '',
  description: '',
  amount: 1,
  category_id: null,
  category_move: RequestTypeCategory.Category,
  cash_id: null,
  cost_center_id: null,
  retention: Retention.No,
  amount_net: null,
  amount_ret: null,
}

export const defaultTransferForm: Partial<IRequest> = {
  request_type: RequestType.Transfer,
  description: '',
  amount: 1,
  category_id: null,
  category_account_id: null,
  category_move: RequestTypeCategory.Cash,
  account_flow: AccountFlow.Input,
  cash_id: null,
  cash_account_id: null,
}

export const simpleFormSt: RecoilState<Partial<IRequest>> = atom({
  key: 'simpleFormState',
  default: defaultSimpleForm,
})

export const liquidationFormSt: RecoilState<Partial<IRequest>> = atom({
  key: 'liquidationFormSt',
  default: defaultLiquidationForm,
})

export const transferFormSt: RecoilState<Partial<IRequest>> = atom({
  key: 'transferFormState',
  default: defaultTransferForm,
})

export const requestChangesSt: RecoilState<number> = atom({
  key: 'requestChanges',
  default: 0,
})

export const setRequestChangeSt = selector({
  key: 'setRequestChangeSt',
  get: ({ get }) => {
    return get(requestChangesSt)
  },
  set: ({ set, get }) => {
    const num = get(requestChangesSt)
    set(requestChangesSt, num + 1)
  },
})
