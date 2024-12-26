import { inventoryApi } from '@/lib/api/inventory'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'
import { SelectProps } from 'antd/lib'

export const SucursalesSelect = (props: SelectProps) => {
  const query = useQuery({
    queryKey: ['sucursales'],
    queryFn: () => inventoryApi.sucursales(),
    staleTime: Infinity,
  })

  return (
    <Select
      {...props}
      loading={query.isLoading}
      showSearch
      filterOption={filterSelectForm}
    >
      {query.data?.map((el) => {
        return (
          <Select.Option value={el.id} key={el.id}>
            {el.title}
          </Select.Option>
        )
      })}
    </Select>
  )
}
