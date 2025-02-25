import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { CostCenterSelecet } from '@pizzadb'
import { Button, Input, Select } from 'antd'
import { useMemo } from 'react'
import { useCreateCostCenter } from './drawers/create'
import { useCostCenter } from './state'

export const menuOptions: FilterOption<CostCenterSelecet>[] = [
  {
    key: 'id',
    label: 'Id',
    operators: ['equal'],
    type: 'number',
    whereOption: {
      field: 'id',
    },
  },
  {
    key: 'costcenter',
    hide: true,
    label: 'Nombre',
    operators: ['equal'],
    whereOption: {
      field: 'costcenter',
    },
  },
  {
    key: 'status',
    label: 'Estado',
    operators: ['equal'],
    default: () => '1',
    view: ({ fiValue }) => {
      return fiValue === '1' ? 'Activo' : 'Inactivo'
    },
    render: ({ fiValue, onFiChange }) => {
      return (
        <Select value={fiValue} onChange={onFiChange}>
          <Select.Option value="1">Activo</Select.Option>
          <Select.Option value="0">Inactivo</Select.Option>
        </Select>
      )
    },
    whereOption: {
      field: 'status',
    },
  },
]

export function Control() {
  const filters = useCostCenter((st) => st.filters)
  const setFilters = useCostCenter((st) => st.setFilters)
  const { open } = useCreateCostCenter()

  const name = useMemo(() => {
    const element = filters.find((el) => el.field == 'costcenter')

    return (element?.value as string) ?? ''
  }, [filters])

  const changeName = (value: string) => {
    if (value === '') {
      setFilters(filters.filter((el) => el.field !== 'costcenter'))
      return
    }
    const exist = filters.find((el) => el.field == 'costcenter')
    if (exist) {
      setFilters(
        filters.map((el) =>
          el.field == 'costcenter'
            ? {
                ...el,
                value,
              }
            : el,
        ),
      )
    } else {
      setFilters([
        ...filters,
        {
          field: 'costcenter',
          operator: 'equal',
          value,
          key: 'costcenter',
        },
      ])
    }
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3">
        <Input
          value={name}
          placeholder="Centro de costo"
          className="w-72"
          onChange={(ev) => changeName(ev.target.value ?? '')}
          addonBefore="Nombre"
        />
        <FilterComponent
          filters={filters}
          setFilters={setFilters}
          options={menuOptions}
          // onSearch={onSearch}
        />
      </div>
      <Button onClick={() => open()} type="primary">
        Nuevo centro de costo
      </Button>
    </div>
  )
}
