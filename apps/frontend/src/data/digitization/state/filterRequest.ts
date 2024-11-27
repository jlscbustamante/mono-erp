import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

type Fil = {
  date: [string, string]
  supplier: string | null
  ruc: string | null
  num_doc: string | null
  id: number | null
}
export const filterRequestSt: RecoilState<Fil> = atom({
  key: 'filterRequestDigitization',
  default: {
    date: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    supplier: null,
    ruc: null,
    num_doc: null,
    id: null,
  } as Fil,
})
