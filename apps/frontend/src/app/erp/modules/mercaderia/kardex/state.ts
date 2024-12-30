import { Fillime, InvKardex, WhereOption } from 'pizzadb'
import { create } from 'zustand'

interface Store {
  filters: Fillime<InvKardex>
  setWhere: (data: WhereOption<InvKardex>[]) => void
  addWhere: (dat: WhereOption<InvKardex>) => void
  removeWhere: (dat: WhereOption<InvKardex>) => void
  modWhere: (dat: WhereOption<InvKardex>) => void
}

export const useKardexStore = create<Store>((set, get) => ({
  filters: {
    where: [],
    take: 1000,
  },
  setWhere: (data) => {
    const filters = get().filters
    return set({ filters: { ...filters, where: data } })
  },
  addWhere: (data) => {
    const filters = get().filters
    const wheres = filters.where?.filter((el) => el.field != data.field) ?? []
    return set({
      filters: {
        ...filters,
        where: [...wheres, data],
      },
    })
  },
  removeWhere: (data) => {
    const filters = get().filters
    const wheres = filters.where?.filter((el) => el.field != data.field)
    return set({
      filters: {
        ...filters,
        where: wheres,
      },
    })
  },
  modWhere: (data) => {
    const filters = get().filters
    const wheres = filters.where?.map((el) => {
      if (el.field == data.field) {
        return {
          ...el,
          operator: data.operator,
          value: data.value,
        }
      } else return el
    })
    return set({
      filters: {
        ...filters,
        where: wheres,
      },
    })
  },
}))
