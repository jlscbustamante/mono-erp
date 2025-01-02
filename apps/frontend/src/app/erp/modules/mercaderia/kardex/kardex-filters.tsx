import { FillimeSelector } from '@/components/fillime/selector'
import { FilterOption } from '@/components/fillime/types'
import { Button } from 'antd'
import type { InvKardex } from 'pizzadb'
import { useKardexStore } from './state'

const options: FilterOption<InvKardex>[] = [
  {
    title: 'Id',
    index: 'id',
    options: ['equal', 'select'],
    type: 'num',
    noAllowClear: true,
  },
  {
    title: 'F. creación',
    index: 'created_at',
    options: ['equal', 'select'],
    type: 'range',
    default: ['2021-01-01', '2021-12-31'],
  },
  {
    title: 'Item',
    index: 'item_name',
    default: 'nad item name',
    options: ['equal', 'select'],
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
