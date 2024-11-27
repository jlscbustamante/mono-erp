import { atom, RecoilState } from 'recoil'

import {
  IFilterCashAccountType,
  ITypeCashAccount,
} from '@/data/cashAccount/types/cashTypes'
import { Filters } from '@/data/types/Filters'

export const filterCashAccountTypeSt: RecoilState<IFilterCashAccountType[]> =
  atom({
    key: 'filterCashAccountTypeSt',
    default: [] as IFilterCashAccountType[],
  })
export const filterCashAccountType: RecoilState<Filters<ITypeCashAccount>> =
  atom({
    key: 'filterCashAccountType',
    default: {} as Filters<ITypeCashAccount>,
  })
