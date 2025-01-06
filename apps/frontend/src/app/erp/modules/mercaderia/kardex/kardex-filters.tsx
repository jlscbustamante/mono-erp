import { FiDatePicker } from '@/components/fillime/components/date'
import { FiRangePicker } from '@/components/fillime/components/range'
import { ActionFilters } from '@/components/fillime/filter-actions'
import { FillimeSelector } from '@/components/fillime/selector'
import { ComponentFiRender, FilterOption } from '@/components/fillime/types'
import { SelectItem, SelectItemShow } from '@/hooks/selects/item-select'
import { SelectSucursal } from '@/hooks/selects/sucursal-select'
import { InputNumberProps } from 'antd'
import dayjs from 'dayjs'
import type { Fillime, InvKardex } from 'pizzadb'
import { useKardexStore } from './state'

const options: FilterOption<InvKardex>[] = [
  {
    title: 'Id',
    index: 'id',
    options: ['equal'],
    props: { size: 'small' } satisfies InputNumberProps,
    type: 'num',
    default: 0,
  },
  {
    title: 'F. movimiento',
    hide: true,
    noAllowClear: true,
    index: 'move_at',
    options: ['equal', 'range'],
    defaultByOp: {
      equal: dayjs().format('YYYY-MM-DD'),
      range: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    },
    view: ({ value }) => {
      if (typeof value == 'string') return <span>{value}</span>
      const [start, end] = value as [string, string]
      return (
        <span>
          {start} - {end}
        </span>
      )
    },
    render: (props: ComponentFiRender) => {
      if (props.operator == 'range')
        return <FiRangePicker {...props} size="small" allowClear={false} />
      return <FiDatePicker {...props} allowClear={false} size="small" />
    },
    mods: {
      field: 'DATE($x)',
    },
  },
  {
    title: 'Item',
    index: 'item_id',
    options: ['equal', 'in'],
    view: ({ value }) => <SelectItemShow value={value} />,
    render: (props: ComponentFiRender) => {
      return (
        <SelectItem
          {...props}
          className="w-52"
          size="small"
          mode={props.operator === 'in' ? 'multiple' : undefined}
        />
      )
    },
  },
  {
    title: 'Tienda',
    index: 'warehouse_id',
    options: ['equal', 'in'],
    render: (props: ComponentFiRender) => {
      return (
        <SelectSucursal
          {...props}
          className="w-44"
          size="small"
          mode={props.operator == 'in' ? 'multiple' : undefined}
        />
      )
    },
  },
]

export const KardexFilters = ({
  filterKardex,
  isLoading,
}: {
  filterKardex: (filters: Fillime<InvKardex>) => void
  isLoading?: boolean
}) => {
  const filters = useKardexStore((st) => st.filters)
  const addFilter = useKardexStore((st) => st.addWhere)
  const removeFilter = useKardexStore((st) => st.removeWhere)
  const modFilter = useKardexStore((st) => st.modWhere)
  const clear = useKardexStore((st) => st.clear)

  const handleSearch = () => {
    const filtersNoEmpties: Fillime<InvKardex> = {
      ...filters,
      where: filters.where?.filter((el) => el.value || el.operator == 'isNull'),
    }
    filterKardex(filtersNoEmpties)
  }

  const handleClear = () => {
    const keysAllowed = options
      .filter((el) => el.noAllowClear)
      .map((el) => el.index)
    clear(keysAllowed)
  }

  return (
    <div className="flex gap-2">
      <FillimeSelector
        options={options}
        filters={filters.where}
        addFilter={addFilter}
        removeFilter={removeFilter}
        modFilter={modFilter}
      />
      <ActionFilters
        search={handleSearch}
        clear={handleClear}
        loading={isLoading}
      />
    </div>
  )
}
