import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { RequirementSelect } from '@pizzadb'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Calendar, Logs } from 'lucide-react'
import { useMemo } from 'react'
import { useApprovedStore } from './state'

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
    key: 'created_by',
    label: 'Creado por',
    operators: ['contain', 'equal'],
    whereOption: {
      field: 'created_by',
    },
  },
]

export function Control({
  onRefetch,
  toggleView,
}: {
  onRefetch?: () => void
  toggleView?: () => void
}) {
  const filters = useApprovedStore((st) => st.filters)
  const setFilters = useApprovedStore((st) => st.setFilters)

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
      <div className="flex border border-solid border-slate-300 rounded-md ml-2">
        <div className="bg-slate-200 p-1 flex items-center justify-center">
          <Logs className="w-5 h-auto" />
        </div>
        <div
          className="px-2 py-1 flex items-center justify-center cursor-pointer"
          onClick={toggleView}
        >
          <Calendar className="w-5 h-auto" />
        </div>
      </div>
    </div>
  )
}
