import { Select } from 'antd'

import { IInvProductItem } from '@/data/products/types'
import { filterOption } from '@/utils'
import { useItems } from '@/views/products/templates/edit/useItems'

export const SelectItems = ({
  className,
  value,
  onChange,
}: {
  className?: string
  value?: number
  onChange: (s: IInvProductItem) => void
}) => {
  const query = useItems()
  return (
    <Select
      value={value}
      placeholder="selecciona el item"
      size="small"
      onChange={(_, opt) => {
        onChange((opt as any).raw as IInvProductItem)
      }}
      loading={query.isLoading}
      showSearch
      filterOption={filterOption as any}
      className={className}
      options={query.data?.items
        .map((el) => {
          return {
            label: el.itemName,
            value: el.id,
            raw: el,
          }
        })
        .sort((a, b) => a.label.localeCompare(b.label))}
    />
  )
}
