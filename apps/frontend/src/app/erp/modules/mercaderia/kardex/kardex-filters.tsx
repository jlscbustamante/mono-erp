import { FillimeSelector } from '@/components/fillime/selector'
import { FilterOption } from '@/components/fillime/types'
import { Button } from 'antd'
import type { InvKardex } from 'pizzadb'
import { useKardexStore } from './state'

const options: FilterOption<InvKardex>[] = [
  {
    title: 'Id',
    index: 'id',
    // options: [Operator.Equal, Operator.NotEqual],
    options: ['equal', 'select'],
  },
  {
    title: 'F. creación',
    index: 'created_at',
    // options: [Operator.Equal, Operator.NotEqual],
    options: ['equal', 'select'],
  },
  {
    title: 'Item',
    index: 'item_name',
    hide: true,
    default: 'nad item name',
    // options: [Operator.Equal, Operator.NotEqual],
    options: ['equal', 'select'],
  },
  {
    title: 'F. movimiento',
    index: 'move_at',
    // options: [Operator.Equal],
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
