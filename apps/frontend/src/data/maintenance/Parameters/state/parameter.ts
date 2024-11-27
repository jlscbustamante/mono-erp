import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { IParameter } from '../type/Parameters'

export const filterParameterSt: RecoilState<Filters<IParameter>> = atom({
  key: 'filterParameterSt',
  default: {} as Filters<IParameter>,
})

export const filterIParameter: RecoilState<IParameter[]> = atom({
  key: 'filterIParameter',
  default: [] as IParameter[],
})
