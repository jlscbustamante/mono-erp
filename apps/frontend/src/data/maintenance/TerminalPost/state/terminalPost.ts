import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ITerminalPost } from '../type/TerminalPost'

export const filterITerminalPostSt: RecoilState<Filters<ITerminalPost>> = atom({
  key: 'filterITerminalPostSt',
  default: {} as Filters<ITerminalPost>,
})

export const filterITerminalPost: RecoilState<ITerminalPost[]> = atom({
  key: 'filterITerminalPost',
  default: [] as ITerminalPost[],
})
