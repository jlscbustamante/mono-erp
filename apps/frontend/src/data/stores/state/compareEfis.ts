import { Dayjs } from 'dayjs'
import { atom, RecoilState, selector } from 'recoil'

import { ICompareEfis, StatusCompare } from '../types'

export const compareEfisSt: RecoilState<ICompareEfis[]> = atom({
  key: 'compareEfis',
  default: [] as ICompareEfis[],
})

export const filtersCompareSt = atom({
  key: 'filtersCompareEfis',
  default: {
    descuadre: false,
    contabilizado: false,
    pendiente: false,
    listo: false,
    cerrado: false,
  },
})

export const filteredCompareEfisSt = selector({
  key: 'filteredCompareEfis',
  get: ({ get }) => {
    const compareEfis = get(compareEfisSt)
    const filters = get(filtersCompareSt)
    const { descuadre, contabilizado, pendiente, listo, cerrado } = filters
    const allowStatus: StatusCompare[] = []
    if (descuadre) allowStatus.push(StatusCompare.Descuadre)
    if (contabilizado) allowStatus.push(StatusCompare.Contabilizado)
    if (pendiente) allowStatus.push(StatusCompare.Pendiente)
    if (listo) allowStatus.push(StatusCompare.Listo)
    if (cerrado) allowStatus.push(StatusCompare.Cerrado)
    if (!allowStatus.length) return compareEfis
    return compareEfis.filter((compareEfis) => {
      const valid = allowStatus.some((status) =>
        compareEfis.status.includes(status),
      )
      if (valid) return true
    })
  },
})

export const dateFilterCompareSt: RecoilState<
  [Dayjs | null, Dayjs | null] | null
> = atom({
  key: 'dateFilterCompareEfis',
  default: null as [Dayjs | null, Dayjs | null] | null,
})
