import { atom, RecoilState } from 'recoil'

import { ICashAccount } from '@/data/cashAccount/types'
import { ICategory } from '@/data/category/types'
import { ICostCenter } from '@/data/costCenter/types'

export const categoriesRequestSt: RecoilState<ICategory[]> = atom({
  key: 'categoriesResource',
  default: [] as ICategory[],
})

export const cashAccountRequestSt: RecoilState<ICashAccount[]> = atom({
  key: 'cashAccountResource',
  default: [] as ICashAccount[],
})

export const costCentersSt: RecoilState<ICostCenter[]> = atom({
  key: 'costCentersResource',
  default: [] as ICostCenter[],
})

export const cashAccountStoreSt: RecoilState<ICashAccount[]> = atom({
  key: 'cashAccountStore',
  default: [] as ICashAccount[],
})

export const categoriesStoreSt: RecoilState<ICategory[]> = atom({
  key: 'categoriesResourceStore',
  default: [] as ICategory[],
})
