import { atom, RecoilState } from 'recoil'

import { IFilterMenuReport, IReport } from '@/data/reports/types/report'
import { Filters } from '@/data/types/Filters'

export const menuReportSt: RecoilState<Filters<IReport>> = atom({
  key: 'menuReportSt',
  default: {} as Filters<IReport>,
})
export const menuReport: RecoilState<IFilterMenuReport[]> = atom({
  key: 'menuReport',
  default: [] as IFilterMenuReport[],
})
