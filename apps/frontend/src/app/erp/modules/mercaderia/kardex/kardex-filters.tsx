import { FiDatePicker } from '@/components/fillime/components/date'
import { FiRangePicker } from '@/components/fillime/components/range'
import { FillimeSelector } from '@/components/fillime/selector'
import { ComponentFiRender, FilterOption } from '@/components/fillime/types'
import { SelectItem } from '@/hooks/selects/item-select'
import { Button, InputNumberProps } from 'antd'
import type { InvKardex } from 'pizzadb'
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
    title: 'F. creación',
    index: 'created_at',
    options: ['equal', 'range'],
    defaultByOp: {
      equal: '2024-12-12',
      range: ['2024-11-11', '2024-11-12'],
    },
    render: (props: ComponentFiRender) => {
      if (props.operator == 'range') {
        return <FiRangePicker {...props} size="small" allowClear={false} />
      }
      return <FiDatePicker {...props} size="small" />
    },
    mods: {
      field: 'DATE($x)',
    },
  },
  {
    title: 'Item',
    index: 'item_name',
    options: ['select', 'in'],
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
    title: 'F. movimiento',
    index: 'move_at',
    options: ['equal'],
  },
]

export const KardexFilters = () => {
  const filters = useKardexStore((st) => st.filters)
  const addFilter = useKardexStore((st) => st.addWhere)
  const removeFilter = useKardexStore((st) => st.removeWhere)
  const modFilter = useKardexStore((st) => st.modWhere)

  return (
    <div>
      <FillimeSelector
        options={options}
        filters={filters.where}
        addFilter={addFilter}
        removeFilter={removeFilter}
        modFilter={modFilter}
      />
      <Button
        onClick={() => {
          console.log('imprimir : ', filters)
        }}
      >
        Imprimir
      </Button>
    </div>
  )
}
