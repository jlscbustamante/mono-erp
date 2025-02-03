import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { RequirementSelect, WhereOption } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { usePendingStore } from './state'

const { RangePicker } = DatePicker

const menuOptions: FilterOption<RequirementSelect>[] = [
  {
    key: 'id',
    label: 'Id',
    operators: ['equal'],
    whereOption: {
      field: 'id',
    },
  },
  {
    key: 'description',
    label: 'Descripcion',
    operators: ['contain', 'equal'],
    whereOption: {
      field: 'description',
    },
  },
  {
    key: 'amount',
    label: 'Monto',
    type: 'number',
    operators: ['equal'],
    whereOption: {
      field: 'amount',
    },
  },
  {
    key: 'num_document',
    label: 'N° doc.',
    operators: ['contain', 'equal'],
    whereOption: {
      field: 'num_document',
    },
  },
  {
    key: 'created_by',
    label: 'Creado por',
    operators: ['contain', 'equal'],
    whereOption: {
      field: 'created_by',
    },
  },
]

export function Control() {
  const navigate = useNavigate()
  const filters = usePendingStore((st) => st.filters)
  const setFilters = usePendingStore((st) => st.setFilters)

  const dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] = useMemo(() => {
    const dates = filters.find(
      (el) => el.key == ('requested_at' satisfies keyof RequirementSelect),
    )
    if (dates) {
      const [start, end] = dates.value as [string, string]
      return [dayjs(start), dayjs(end)]
    }
    return [null, null]
  }, [filters])

  const changeDate = (dates: [dayjs.Dayjs, dayjs.Dayjs]) => {
    const [start, end] = dates

    const newFilters = filters.filter(
      (el) => el.key != ('requested_at' satisfies keyof RequirementSelect),
    )

    setFilters([
      ...newFilters,
      {
        field: 'requested_at',
        key: 'requested_at',
        operator: 'range',
        useMods: true,
        value: [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')],
        mods: {
          field: ['DATE'],
        },
      },
    ])
  }

  const filterMutation = useMutation({
    mutationFn: async (options: WhereOption<RequirementSelect>[]) => {
      console.log('op : ', options)
      const request = await viewClient.api.view.requirement.filter.$get({
        query: {
          filters: JSON.stringify(options),
        },
      })
      const data = await request.json()
      console.log('data : ', data)
      return []
    },
  })

  return (
    <div className="flex justify-between items-center">
      <div className="flex-1 flex gap-1">
        <RangePicker
          value={dates}
          allowClear={false}
          onChange={(val) => {
            if (val?.[0] && val?.[1]) {
              changeDate([val[0], val[1]])
            }
          }}
        />
        <FilterComponent
          options={menuOptions}
          filters={filters}
          setFilters={setFilters}
          onSearch={(filters) => {
            filterMutation.mutate(filters)
          }}
        />
      </div>
      <Button
        size="middle"
        type="primary"
        onClick={() => {
          navigate(PATHS.erp.modulos.requerimientos.creation)
        }}
      >
        Nuevo requerimiento
      </Button>
    </div>
  )
}
