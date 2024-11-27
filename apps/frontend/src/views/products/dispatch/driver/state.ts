import { inventoryApi } from '@/lib/api/inventory'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Carrier } from 'pizzadb'
import { useEffect, useMemo } from 'react'
import { Filters3 } from 'shared'

export const filtersAtom = atom<Filters3<Carrier>>({})
export const controlerAtom = atom<number>(0)

export const useFilterDrivers = () => {
  const filters = useAtomValue(filtersAtom)
  const [controler, setControler] = useAtom(controlerAtom)

  const filtersCleaned = useMemo(() => {
    const newFilters: Filters3<Carrier> = {}
    for (const key in filters) {
      const value = filters[key as keyof Carrier]
      if (value?.[1]) {
        newFilters[key as keyof Carrier] = value
      }
    }
    return newFilters
  }, [filters])

  useEffect(() => {
    if (Object.keys(filters).length == 0 && controler > 0) {
      setControler(0)
    }
  }, [filters])

  const query = useQuery({
    queryKey: ['driver/filter', controler],
    queryFn: () => {
      return inventoryApi.filterCarrier({ filters: filtersCleaned })
    },
  })

  return query
}
