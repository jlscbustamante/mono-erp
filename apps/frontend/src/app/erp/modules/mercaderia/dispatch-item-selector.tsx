import { Button, Popover, Select } from 'antd'

import { filterSelectForm } from '@/utils'
import { useItems } from '@/views/products/hooks/use-items'
import { useLocalStorage } from '@uidotdev/usehooks'

export const DispatchItemSelector = () => {
  const { selected, items, setSelected } = useItemsSelected()
  const content = (
    <Select
      className="w-80"
      placeholder="Alertar items"
      mode="multiple"
      filterOption={filterSelectForm}
      value={selected}
      onChange={(val: number[]) => {
        setSelected(val)
      }}
    >
      {items.map((el) => (
        <Select.Option key={el.id} value={el.id}>
          {el.name}
        </Select.Option>
      ))}
    </Select>
  )

  return (
    <Popover content={content} placement="bottom" trigger={'click'}>
      <Button>{selected.length} items observados</Button>
    </Popover>
  )
}

const useItemsSelected = () => {
  const [selected, setSelected] = useLocalStorage<number[]>(
    'dispatchItemSelector',
    [],
  )
  const query = useItems()

  return { selected, items: query.data ?? [], setSelected }
}
