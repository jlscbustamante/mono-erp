import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

export const dateFilterSt: RecoilState<string> = atom({
  key: 'dateFilterStore',
  default: dayjs().format('YYYY-MM-DD'),
})

export const storeFilterSt: RecoilState<null | number> = atom({
  key: 'storeFilter',
  default: null as null | number,
})
