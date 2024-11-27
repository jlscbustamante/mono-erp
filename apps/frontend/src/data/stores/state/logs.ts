import { atom, RecoilState } from 'recoil'

type TLogs = {
  date: string
  logs?: string[] | { name: string; contable: string; moves: string }[]
  loading: boolean
  success: boolean
  noprocess?: boolean
  informe?: {
    name: string
    contable: string
    moves: string
  }[]
}[]

export const AELogsSt: RecoilState<TLogs> = atom({
  key: 'logsCashMovesAE',
  default: [] as TLogs,
})
