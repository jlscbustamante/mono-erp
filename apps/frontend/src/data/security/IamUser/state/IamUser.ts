import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { IFilterIamUser, IIamUser } from '../type/IamUser'

export const filterIamUserSt: RecoilState<Filters<IIamUser>> = atom({
  key: 'filterIamUser',
  default: {} as Filters<IIamUser>,
})
export const IamUserSt: RecoilState<IFilterIamUser[]> = atom({
  key: 'filtersIamUser',
  default: [] as IFilterIamUser[],
})
