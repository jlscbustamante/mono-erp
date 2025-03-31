import { Dropdown } from 'antd'
import { IoMdAddCircleOutline } from 'react-icons/io'

import { Filters3, OpFilter } from '@/data/types/Filters'

export type FilterOPtions = {
  label: string
  key: string
  options: OpFilter[]
  selection?: { label: string; value: string | number }[]
}

interface IComponentProps<T> {
  userFilters?: Filters3<T>
  setUserFilters?: (newFilters: Filters3<T>) => void
  items: FilterOPtions[]
}

export const AddFilterButton = <T,>(props: IComponentProps<T>) => {
  const addFilter = (key: keyof T, option: OpFilter) => {
    if (props.setUserFilters) {
      if (!props.userFilters?.[key]) {
        props.setUserFilters({
          ...props.userFilters,
          [key]: [option],
        })
        return
      }
    }
  }

  return (
    <div className="w-32 border border-solid border-gray-300 rounded-md text-sm flex items-center gap-1 cursor-pointer hover:border-blue-600 hover:text-blue-600">
      <Dropdown
        menu={{
          items: props.items.map((el) => ({
            key: el.key,
            label: el.label,
            onClick: () =>
              addFilter(el.key as keyof T, el.options[0] ?? OpFilter.Equal),
          })),
        }}
        trigger={['click']}
        placement="bottom"
        className="w-full p-1"
      >
        <div className="flex justify-between items-center">
          <IoMdAddCircleOutline />
          <span>Agregar filtro</span>
        </div>
      </Dropdown>
    </div>
  )
}
