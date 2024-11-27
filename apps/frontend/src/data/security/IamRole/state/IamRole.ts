import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { IFilterIamRole, IIamRole } from '../type/IamRole'

export const filterIamRoleSt: RecoilState<Filters<IIamRole>> = atom({
  key: 'filterIamRole',
  default: {} as Filters<IIamRole>,
})
export const IamRoleSt: RecoilState<IFilterIamRole[]> = atom({
  key: 'filtersIamRole',
  default: [] as IFilterIamRole[],
})
