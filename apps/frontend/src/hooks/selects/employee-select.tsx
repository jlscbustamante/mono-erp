import { ComponentFiRender } from '@/components/fillime/types'
import { rhApi } from '@/lib/api/rh'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectProps } from 'antd'
import { Fillime, RhEmployee } from 'pizzadb'
import { useMemo } from 'react'

export const useEmployeeSelect = (filters: Fillime<RhEmployee>) => {
  const filjson = JSON.stringify(filters)
  const query = useQuery({
    queryKey: ['select:employees', filjson],
    queryFn: () => rhApi.fillimeEmployees(filters),
    staleTime: 1000 * 60 * 20,
  })

  return query
}

const defaultFilter: Fillime<RhEmployee> = {
  order: {
    first_name: 'ASC',
  },
}

export const SelectEmployeeShow = ({ value }: { value: unknown }) => {
  const query = useEmployeeSelect(defaultFilter)
  const named = useMemo(() => {
    const id = Array.isArray(value) ? value[0] : value
    if (!id) return '...'

    if (id == '$$isNull$$') return 'SIN TIENDA' + '...'
    const name = query.data?.find((il) => il.id == id)
    if (!name) return '...'
    return name.first_name.substring(0, 12) + '...'
  }, [value, query.data])

  return `${named}`
}

export const SelectEmployee = (props: SelectProps & ComponentFiRender) => {
  const query = useEmployeeSelect(defaultFilter)
  const { filValue, onFilChange, ...restProps } = props

  return (
    <Select
      size="small"
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
            {`${el.first_name} ${el.last_name}`}
          </Select.Option>
        )
      })}
    </Select>
  )
}
