import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ICashAccount, IFilterCashAccount } from '../types/cashAccount'

export const filterCashAccountSt: RecoilState<Filters<ICashAccount>> = atom({
  key: 'filterCashAccount',
  default: {} as Filters<ICashAccount>,
})
export const cashAccountsSt: RecoilState<IFilterCashAccount[]> = atom({
  key: 'filtersCashAccounts',
  default: [] as IFilterCashAccount[],
})
