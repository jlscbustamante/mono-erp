import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ICostCenter, IFilterCostCenter } from '../types'

export const filterCostCenterSt: RecoilState<Filters<ICostCenter>> = atom({
  key: 'filterCostCenterSt',
  default: {} as Filters<ICostCenter>,
})
export const filtersCostCenter: RecoilState<IFilterCostCenter[]> = atom({
  key: 'filtersCostCenter',
  default: [] as IFilterCostCenter[],
})
