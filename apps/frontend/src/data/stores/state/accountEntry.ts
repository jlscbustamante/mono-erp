import { format, parseISO, sub } from 'date-fns'
import dayjs from 'dayjs'
import { atom, RecoilState } from 'recoil'

import { CashBalanceStatus } from '@/data/types'

export const dateFilterAESt = atom({
  key: 'dateFilterAEStore',
  default: [
    format(
      sub(parseISO(dayjs().format('YYYY-MM-DD')), { days: 7 }),
      'yyyy-MM-dd',
    ),
    dayjs().format('YYYY-MM-DD'),
  ],
})

export const selectedDaysAESt: RecoilState<string[]> = atom({
  key: 'selectedDaysStoreAE',
  default: [] as string[],
})

export const balancesReportSt: RecoilState<{
  [key: string]: CashBalanceStatus
}> = atom({
  key: 'balancesReportStore',
  default: {},
})
