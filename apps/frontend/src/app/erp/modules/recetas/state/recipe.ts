import { atom, RecoilState } from 'recoil'

import { Filters } from '../Filters'

import { InvRecipe, InvRecipeFilter } from '../shared-types'

export const filterInvRecipeSt: RecoilState<Filters<InvRecipe>> = atom({
  key: 'filterInvRecipe',
  default: {} as Filters<InvRecipe>,
})

export const filterIFilterInvRecipe: RecoilState<InvRecipeFilter[]> = atom({
  key: 'filterIFilterInvRecipe',
  default: [] as InvRecipeFilter[],
})
/*
export const filterTypeRecipeSt: RecoilState<Filters<ITypeRecipe>> = atom({
  key: 'filterTypeRecipe',
  default: {} as Filters<ITypeRecipe>,
})

export const filterITypeFilterRecipe: RecoilState<ITypeRecipe[]> = atom({
  key: 'filterITypeFilterRecipe',
  default: [] as ITypeRecipe[],
})
*/
