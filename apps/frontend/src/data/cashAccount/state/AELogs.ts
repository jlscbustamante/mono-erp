import { atom, RecoilState } from 'recoil'

type TLogs = {
  date: string
  logs?: string[]
  loading: boolean
  success: boolean
  noprocess?: boolean
}[]
export const AELogsSt: RecoilState<TLogs> = atom({
  key: 'AELogs',
  default: [] as TLogs,
})
