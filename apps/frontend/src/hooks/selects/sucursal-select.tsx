import { ComponentFiRender } from '@/components/fillime/types'
import { inventoryApi } from '@/lib/api/inventory'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import { Fillime, Sucursal } from 'pizzadb'
import { useMemo } from 'react'

export const useSucursalSelect = (filters: Fillime<Sucursal>) => {
  const filjson = JSON.stringify(filters)
  const query = useQuery({
    queryKey: ['select:items', filjson],
    queryFn: () => inventoryApi.filterSucursal(filters),
    staleTime: Infinity,
  })

  return query
}

const defaultFilter: Fillime<Sucursal> = {
  select: {
    id: true,
    title: true,
  },
  order: {
    title: 'ASC',
  },
}

export const SelectSucursalShow = ({ value }: { value: unknown }) => {
  const query = useSucursalSelect(defaultFilter)
  const named = useMemo(() => {
    const id = Array.isArray(value) ? value[0] : value
    if (!id) return '...'

    const name = query.data?.find((il) => il.id == id)
    if (!name) return '...'
    return name.title.substring(0, 12) + '...'
  }, [value, query.data])
  return `${named}`
}

export const SelectSucursal = (props: SelectProps & ComponentFiRender) => {
  const query = useSucursalSelect(defaultFilter)

  const { filValue, onFilChange, ...restProps } = props

  return (
    <Select
      {...restProps}
      value={filValue}
      onChange={(val) => {
        onFilChange(val)
      }}
      filterOption={filterSelectForm}
      showSearch
    >
      {query.data?.map((el) => {
        return (
          <Select.Option key={el.id} value={el.id}>
            {el.title}
          </Select.Option>
        )
      })}
    </Select>
  )
}
