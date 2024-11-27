import { atom, RecoilState } from 'recoil'

import { IAdmFile } from '../types'

export const admFilesSt: RecoilState<IAdmFile[]> = atom({
  key: 'filteredAdmFiles',
  default: [] as IAdmFile[],
})
