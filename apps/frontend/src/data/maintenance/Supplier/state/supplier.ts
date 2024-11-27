import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ISupplier } from '../type/Supplier'

export const filterSupplierSt: RecoilState<Filters<ISupplier>> = atom({
  key: 'filterSupplierSt',
  default: {} as Filters<ISupplier>,
})

export const filterISupplier: RecoilState<ISupplier[]> = atom({
  key: 'filterISupplier',
  default: [] as ISupplier[],
})
