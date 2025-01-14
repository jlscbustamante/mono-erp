import dayjs from 'dayjs'
import { Attendance, Fillime, Item, WhereOption } from 'pizzadb'
import { create } from 'zustand'

interface Store {
  filters: Fillime<Attendance>
  setWhere: (data: WhereOption<Attendance>[]) => void
  addWhere: (dat: WhereOption<Attendance>) => void
  removeWhere: (dat: WhereOption<Attendance>) => void
  clear: (keys: string[]) => void
  modWhere: (dat: WhereOption<Attendance>) => void
  data: Item[]
  setData: (data: Item[]) => void
}

export const useAttendanceStore = create<Store>((set, get) => ({
  filters: {
    where: [
      {
        field: 'attendance_at',
        operator: 'equal',
        value: dayjs().format('YYYY-MM-DD'),
        mods: {
          field: 'DATE($x)',
        },
      },
    ],
    take: 1000,
    relations: {
      employee: true,
      sucursal: true,
    },
    order: {
      employee: {
        first_name: 'ASC',
      },
    },
  },
  data: [],
  setData: (dat) => set({ data: dat }),
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
  clear: (keys) => {
    const filters = get().filters
    const wheres = filters.where?.filter((el) => keys.includes(el.field))
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
