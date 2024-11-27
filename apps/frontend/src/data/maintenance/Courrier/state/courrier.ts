import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ICourrier } from '../type/Courrier'

export const filterCourrierSt: RecoilState<Filters<ICourrier>> = atom({
  key: 'filterCourrierSt',
  default: {} as Filters<ICourrier>,
})

export const filterICourrier: RecoilState<ICourrier[]> = atom({
  key: 'filterICourrier',
  default: [] as ICourrier[],
})
