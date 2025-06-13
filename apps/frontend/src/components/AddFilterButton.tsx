import { Dropdown } from 'antd'
import { IoMdAddCircleOutline } from 'react-icons/io'

import { Filters, OpFilter } from '@/data/types/Filters'

interface IComponentProps<T> {
  setUserFilters: (valorOrUpdater: Filters<T>) => void
  userFilters: Filters<T>
  getFilterTypesForKey: (key: keyof T) => OpFilter[]
  items: { label: string; key: string }[]
}

export const FilterAddButton = <T,>(props: IComponentProps<T>) => {
  const addFilter = (key: keyof T) => {
    //console.log('tipo')
    //console.log(key)
    if (!props.userFilters[key]) {
      const optionsFilter = props.getFilterTypesForKey(key)
      props.setUserFilters({
        ...props.userFilters,
        [key]: [optionsFilter[0]],
      })
    }
    //console.log('props')
    //console.log(props)
  }
  return (
    <Dropdown
      menu={{
        items: props.items.map((el) => ({
          key: el.key,
          label: <span>{el.label}</span>,
          onClick: () => addFilter(el.key as keyof T),
        })),
      }}
      className="max-w-xs h-auto"
      placement="bottom"
      trigger={['click']}
    >
      <div className="border border-solid border-gray-300 rounded-md p-1 text-sm flex items-center gap-1 cursor-pointer hover:border-blue-600 hover:text-blue-600">
        <IoMdAddCircleOutline />
        <span>agregar filtro</span>
      </div>
    </Dropdown>
  )
}
