import { format, parseISO, sub } from 'date-fns'
import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

import { CashBalanceStatus } from '@/data/types'

export const balancesReportSt: RecoilState<{
  [key: string]: CashBalanceStatus
}> = atom({
  key: 'balancesReportReq',
  default: {},
})

export const dateBalanceReportSt: RecoilState<[string, string]> = atom({
  key: 'dateBalanceReport',
  default: [
    format(
      sub(parseISO(dayjs().format('YYYY-MM-DD')), { days: 7 }),
      'yyyy-MM-dd',
    ),
    dayjs().format('YYYY-MM-DD'),
  ],
})

export const selectedDaysAESt: RecoilState<string[]> = atom({
  key: 'selectedDaysAE',
  default: [] as string[],
})

export const checkedReplaceSt: RecoilState<boolean> = atom({
  key: 'checkedReplace',
  default: false,
})
