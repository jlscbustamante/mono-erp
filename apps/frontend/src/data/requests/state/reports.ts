import dayjs from 'dayjs'
import { atom, RecoilState, RecoilValueReadOnly, selector } from 'recoil'

import { ISummaryReport } from '@/data/cashAccount/types/summaryReport'

export const dateSumReportSt = atom({
  key: 'dateFilterReportSumReq',
  default: dayjs().format('YYYY-MM-DD'),
})

export const summariesReportSt: RecoilState<ISummaryReport[]> = atom({
  key: 'summariesReportSumReq',
  default: [] as ISummaryReport[],
})

export const nameSumReportSt = atom({
  key: 'nameFilterReportSumReq',
  default: '',
})

export const filteredSummariesSt: RecoilValueReadOnly<ISummaryReport[]> =
  selector({
    key: 'filteredSummariesReportSumReq',
    get: ({ get }) => {
      const summaries = get(summariesReportSt)
      const name = get(nameSumReportSt)
      if (!name) return summaries
      return summaries.filter((summary) =>
        summary.cashAccount.name
          .toLocaleLowerCase()
          .includes(name.toLocaleLowerCase()),
      )
    },
  })
