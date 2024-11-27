import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ICategory, IFilterCategory, ITypeCategory } from '../types/category'

export const filterCategorySt: RecoilState<Filters<ICategory>> = atom({
  key: 'filterCategory',
  default: {} as Filters<ICategory>,
})

export const filterIFilterCategory: RecoilState<IFilterCategory[]> = atom({
  key: 'filterIFilterCategory',
  default: [] as IFilterCategory[],
})

export const filterTypeCategorySt: RecoilState<Filters<ITypeCategory>> = atom({
  key: 'filterTypeCategory',
  default: {} as Filters<ITypeCategory>,
})

export const filterITypeFilterCategory: RecoilState<ITypeCategory[]> = atom({
  key: 'filterITypeFilterCategory',
  default: [] as ITypeCategory[],
})
