import { ComponentFiRender } from '@/components/fillime/types'
import { inventoryApi } from '@/lib/api/inventory'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import { Fillime, Item } from 'pizzadb'

export const useItemsSelect = (filters: Fillime<Item>) => {
  const filjson = JSON.stringify(filters)
  const query = useQuery({
    queryKey: ['select:items', filjson],
    queryFn: () => inventoryApi.filterItems(filters),
    gcTime: 0,
    staleTime: Infinity,
  })

  return query
}

export const SelectItem = (props: SelectProps & ComponentFiRender) => {
  const query = useItemsSelect({
    select: {
      id: true,
      itemName: true,
    },
  })

  return (
    <Select
      {...props}
      value={props.filValue}
      onChange={(val) => {
        props.onFilChange(val)
      }}
      filterOption={filterSelectForm}
      showSearch
    >
      {query.data
        ?.sort((a, b) => a.itemName.localeCompare(b.itemName))
        .map((el) => {
          return (
            <Select.Option key={el.id} value={el.id}>
              {el.itemName}
            </Select.Option>
          )
        })}
    </Select>
  )
}
