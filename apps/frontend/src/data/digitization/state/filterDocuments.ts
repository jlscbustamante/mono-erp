import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

type Fil = {
  doc_date: [string, string]
  doc_number: string
  doc_request: string
  created_by: string
}
export const filtersDocumentSt: RecoilState<Fil> = atom({
  key: 'filtersDocument',
  default: {
    doc_date: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    doc_number: '',
    doc_request: '',
    created_by: '',
  } as Fil,
})
