import { atom, RecoilState } from 'recoil'

import { Filters } from '@/data/types/Filters'

import { ISucursal } from '../type/Sucursal'
export const filterSucursalSt: RecoilState<Filters<ISucursal>> = atom({
  key: 'filterSucursalSt',
  default: {} as Filters<ISucursal>,
})

export const filterISucursal: RecoilState<ISucursal[]> = atom({
  key: 'filterISucursal',
  default: [] as ISucursal[],
})
