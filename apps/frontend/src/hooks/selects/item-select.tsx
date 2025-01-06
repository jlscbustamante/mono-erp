import { ComponentFiRender } from '@/components/fillime/types'
import { inventoryApi } from '@/lib/api/inventory'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import { Fillime, Item } from 'pizzadb'
import { useMemo } from 'react'

export const useItemsSelect = (filters: Fillime<Item>) => {
  const filjson = JSON.stringify(filters)
  const query = useQuery({
    queryKey: ['select:items', filjson],
    queryFn: () => inventoryApi.filterItems(filters),
    staleTime: Infinity,
  })

  return query
}

const defaultFilter: Fillime<Item> = {
  select: {
    id: true,
    itemName: true,
  },
  order: {
    itemName: 'ASC',
  },
}

export const SelectItemShow = ({ value }: { value: unknown }) => {
  const query = useItemsSelect(defaultFilter)
  const named = useMemo(() => {
    const id = Array.isArray(value) ? value[0] : value
    if (!id) return '...'

    const name = query.data?.find((il) => il.id == id)
    if (!name) return '...'
    return name.itemName.substring(0, 12) + '...'
  }, [value, query.data])
  return `${named}`
}

export const SelectItem = (props: SelectProps & ComponentFiRender) => {
  const query = useItemsSelect(defaultFilter)

  const { filValue, onFilChange, ...restProps } = props

  return (
    <Select
      {...restProps}
      value={filValue}
      onChange={(val) => {
        console.log('valores : ', val)
        onFilChange(val)
      }}
      filterOption={filterSelectForm}
      showSearch
    >
      {query.data?.map((el) => {
        return (
          <Select.Option key={el.id} value={el.id}>
            {el.itemName}
          </Select.Option>
        )
      })}
    </Select>
  )
}
