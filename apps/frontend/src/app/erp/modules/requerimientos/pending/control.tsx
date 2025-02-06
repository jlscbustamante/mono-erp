import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { PATHS } from '@/const/paths'
import { RequirementItemSelect } from '@pizzadb'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { usePendingStore } from './state'

const { RangePicker } = DatePicker

const menuOptions: FilterOption<RequirementItemSelect>[] = [
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
    key: 'created_by',
    label: 'Creado por',
    operators: ['contain', 'equal'],
    whereOption: {
      field: 'created_by',
    },
  },
]

export function Control({ onRefetch }: { onRefetch?: () => void }) {
  const navigate = useNavigate()
  const filters = usePendingStore((st) => st.filters)
  const setFilters = usePendingStore((st) => st.setFilters)

  const dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] = useMemo(() => {
    const dates = filters.find(
      (el) => el.key == ('requested_at' satisfies keyof RequirementItemSelect),
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
      (el) => el.key != ('requested_at' satisfies keyof RequirementItemSelect),
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
          onSearch={() => {
            onRefetch?.()
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
