import { commonApi } from '@/lib/api/common'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useAtomValue } from 'jotai'
import { Sucursal } from 'pizzadb'
import { useEffect, useMemo } from 'react'
import { Filters3 } from 'shared'

export const filtersAtom = atom<Filters3<Sucursal>>({})
export const controlerAtom = atom<number>(0)

export const useFilterSucurales = () => {
  const filters = useAtomValue(filtersAtom)
  const [controler, setControler] = useAtom(controlerAtom)

  const filtersCleaned = useMemo(() => {
    const newFilters: Filters3<Sucursal> = {}
    for (const key in filters) {
      const value = filters[key as keyof Sucursal]
      if (value?.[1]) {
        newFilters[key as keyof Sucursal] = value
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
    queryKey: ['sucursal/filter', controler],
    queryFn: () => {
      return commonApi.getSucursales({ filters: filtersCleaned })
    },
  })

  return query
}
