import { rhApi } from '@/lib/api/rh'
import { useQuery } from '@tanstack/react-query'
import { atom, useAtom, useAtomValue } from 'jotai'
import { RhEmployee } from 'pizzadb'
import { useEffect, useMemo } from 'react'
import { Filters3 } from 'shared'

export const filtersAtom = atom<Filters3<RhEmployee>>({})

export const controlerAtom = atom<number>(0)

export const useFilterEmployees = () => {
  const filters = useAtomValue(filtersAtom)
  const [controller, setControler] = useAtom(controlerAtom)

  const filtersCleaned = useMemo(() => {
    const newFilters: Filters3<RhEmployee> = {}
    for (const key in filters) {
      const value = filters[key as keyof RhEmployee]
      if (value?.[1]) {
        newFilters[key as keyof RhEmployee] = value
      }
    }
    return newFilters
  }, [filters])

  useEffect(() => {
    if (Object.keys(filters).length == 0 && controller > 0) {
      setControler(0)
    }
  }, [filters])

  const query = useQuery({
    queryKey: ['employees/filter', controller],
    queryFn: () => {
      return rhApi.filterEmployees({
        filters: filtersCleaned,
      })
    },
  })

  return query
}
