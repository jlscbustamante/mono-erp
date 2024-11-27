import dayjs from 'dayjs'
import { atom } from 'recoil'

import { IInfoPaymentMethod } from '../types/paymentMethods'

export const infoMpSt = atom<IInfoPaymentMethod[]>({
  key: 'infoPaymentMethod',
  default: [],
})

export const filterDateSt = atom({
  key: 'filterDateMp',
  default: dayjs().format('YYYY-MM-DD'),
})
