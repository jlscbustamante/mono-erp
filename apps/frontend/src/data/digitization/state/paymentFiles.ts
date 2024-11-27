import dayjs from 'dayjs'
import { atom } from 'recoil'

import { Filters, OpFilter } from '@/data/types/Filters'

import { IPaymentFile } from '../types'

export const paymentFilesIzipaySt = atom({
  key: 'paymentFileIzipayst',
  default: [] as IPaymentFile[],
})

export const paymentFilesCulqiSt = atom({
  key: 'paymentFilesCulqist',
  default: [] as IPaymentFile[],
})

export const paymentFilesBankSt = atom({
  key: 'paymentFilesBankSt',
  default: [] as IPaymentFile[],
})

export const paymentFilesFiltersIziSt = atom({
  key: 'paymentFilesFilterszipay',
  default: {
    created_at: [
      OpFilter.RangeDate,
      dayjs().format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  } as Filters<IPaymentFile>,
})

export const paymentFilesFiltersCulqiSt = atom({
  key: 'paymentFilesFiltersCulqi',
  default: {
    created_at: [
      OpFilter.RangeDate,
      dayjs().format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  } as Filters<IPaymentFile>,
})

export const paymentFilesFiltersBankSt = atom({
  key: 'paymentFilesFiltersBank',
  default: {
    created_at: [
      OpFilter.RangeDate,
      dayjs().format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD'),
    ],
  } as Filters<IPaymentFile>,
})
