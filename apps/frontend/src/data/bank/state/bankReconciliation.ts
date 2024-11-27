import { atom } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { IBankReconciliation } from '../types'

export const bankReconciliationsSt = atom({
  key: 'bankReconciliations',
  default: [] as IBankReconciliation[],
})

export const selectedReconciliationSt = atom({
  key: 'selectedReconciliation',
  default: null as IBankReconciliation | null,
})

export const filtersBankReconciliationSt = atom({
  key: 'filtersBankReconciliation',
  default: {} as Filters<IBankReconciliation>,
})
