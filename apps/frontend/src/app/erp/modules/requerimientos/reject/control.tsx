import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { RequirementSelect } from '@pizzadb'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import {
  SupplierSelectForm,
  SupplierTitleForm,
} from '../components/supplier-select'
import { useRejectedStore } from './state'
import { SwitchViewReject } from './switch-view-reject'

const { RangePicker } = DatePicker

export const menuOptions: FilterOption<RequirementSelect>[] = [
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
  {
    key: 'supplier_id',
    label: 'Proveedor',
    operators: ['equal'],
    whereOption: {
      field: 'supplier_id',
    },
    view: ({ fiValue }) => <SupplierTitleForm supplierId={fiValue as number} />,
    render: ({ fiValue, onFiChange }) => {
      return (
        <SupplierSelectForm
          value={fiValue as number}
          onChange={(val) => onFiChange?.(val)}
        />
      )
    },
  },
]

export function Control({ onRefetch }: { onRefetch?: () => void }) {
  const filters = useRejectedStore((st) => st.filters)
  const setFilters = useRejectedStore((st) => st.setFilters)

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
      <SwitchViewReject />
    </div>
  )
}
