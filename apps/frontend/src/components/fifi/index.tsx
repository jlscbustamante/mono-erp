import type { WhereOption } from '@pizzadb'
import { CircleX, Search, X } from 'lucide-react'
import type React from 'react'

import { cn } from '@/utils'
import { Button, Dropdown, Popover, Select } from 'antd'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { FiDatePicker, FiRangeDatePicker } from './component/fi-date'
import { FiInput, FiInputNumber } from './component/fi-input'
import type { FilterComponentProps, FilterOption } from './type'

export function FilterComponent<T>({
  options = [],
  filters = [],
  setFilters,
  onSearch,
  loading,
  hideActions,
}: {
  options?: FilterOption<T>[]
  filters?: WhereOption<T>[]
  setFilters?: (filters: WhereOption<T>[]) => void
  onSearch?: (filters: WhereOption<T>[]) => void
  loading?: boolean
  hideActions?: boolean
}) {
  const changeFilter = (newFilter: WhereOption<T>) => {
    if (setFilters) {
      const isExists = filters.find((el) => el.key == newFilter.key)
      if (isExists) {
        const newFilters = filters.map((el) => {
          if (el.key == newFilter.key) {
            return newFilter
          }
          return el
        })
        setFilters(newFilters)
      } else {
        setFilters([...filters, newFilter])
      }
    }
  }

  const addFilter = (key: string) => {
    const option = options.find((el) => el.key == key)
    if (option) {
      const filter = filters.find((el) => el.key == key)
      if (!filter) {
        const defaultValue = option.default?.(option.operators[0])
        setFilters?.([
          ...filters,
          {
            field: option.whereOption.field,
            key: key,
            operator: option.operators[0],
            useMods: option.whereOption.useMods,
            mods: option.whereOption.mods,
            value: defaultValue,
          },
        ])
      }
    }
  }

  const clearFilters = () => {
    const keys = options.map((el) => el.key)
    setFilters?.(filters.filter((el) => !keys.includes(el.key)))
  }

  const clearFilter = (key: string) => {
    setFilters?.(filters.filter((el) => el.key != key))
  }

  return (
    <div className="flex gap-1 items-center">
      <Dropdown
        trigger={['click']}
        // className="w-48"
        menu={{
          items: options
            .filter((el) => !('isSeparator' in el))
            .map((el) => ({
              key: el.key as string,
              label: el.label,
              onClick: () => addFilter(el.key as string),
            })),
        }}
      >
        <div className="border border-solid border-gray-300 rounded-md p-1 text-sm flex items-center cursor-pointer hover:border-blue-600 hover:text-blue-600 gap-2">
          <IoMdAddCircleOutline />
          Agregar filtro
        </div>
      </Dropdown>
      <div className="flex flex-wrap gap-1">
        {filters.map((el) => {
          const option = options.find((opt) => opt.key == el.key)
          if (!option || option.hide) return null
          return (
            <FilterButton
              key={el.key}
              filter={el}
              option={option}
              clearFilter={clearFilter}
              changeFilter={changeFilter}
            />
          )
        })}
      </div>
      <div
        className={cn('flex items-center gap-1', {
          hidden: hideActions,
        })}
      >
        <Button
          // variant={'filled'}
          type="primary"
          icon={<Search className="w-4 h-4" />}
          // className="p-3 h-8 w-8"
          className="rounded-full"
          loading={loading}
          onClick={() => {
            onSearch?.(filters)
          }}
        >
          {/* <Search className="w-4 h-4" /> */}
        </Button>
        <Button
          variant={'filled'}
          // className="p-3 h-8 w-8"
          className="rounded-full"
          danger
          type="primary"
          onClick={clearFilters}
          icon={<X className="w-4 h-4" />}
        ></Button>
      </div>
    </div>
  )
}

const componentType: Record<string, any> = {
  date: {
    range: FiRangeDatePicker,
    equal: FiDatePicker,
    default: FiDatePicker,
  },
  number: {
    equal: FiInputNumber,
  },
  default: {
    default: FiInput,
  },
}

function FilterButton<T>({
  filter,
  option,
  changeFilter,
  clearFilter,
}: {
  filter: WhereOption<T>
  option: FilterOption<T> | undefined
  changeFilter?: (newFilter: WhereOption<T>) => void
  clearFilter: (key: string) => void
}) {
  let Component: (props: FilterComponentProps) => React.ReactNode
  let ComponentView:
    | ((props: FilterComponentProps) => React.ReactNode)
    | undefined = undefined

  if (!option) {
    Component = componentType.default
  } else {
    if (option.render) {
      Component = option.render
    } else {
      const typeDefault = option.type ?? 'default'
      const components = componentType[typeDefault]
      Component = components[filter.operator] ?? components.default
    }

    if (option.view) {
      ComponentView = option.view
    }
  }

  const content = (
    <div className="flex flex-col min-w-52">
      <Select
        value={filter.operator}
        variant="borderless"
        onChange={(val) => {
          const defaultValue = option?.default?.(val)
          changeFilter?.({ ...filter, operator: val, value: defaultValue })
        }}
      >
        {option?.operators.map((el) => (
          <Select.Option key={el} value={el}>
            {el}
          </Select.Option>
        ))}
      </Select>
      <Component
        fiValue={filter.value}
        onFiChange={(val) => changeFilter?.({ ...filter, value: val })}
        operator={filter.operator}
      />
    </div>
  )

  return (
    <div className="relative flex gap-1">
      <Popover
        content={content}
        className=""
        trigger={'click'}
        placement="bottom"
      >
        <div
          // variant={'outlined'}
          key={filter.key}
          className="cursor-pointer border border-dashed border-gray-300 items-center flex text-sm rounded-md px-1 gap-2 bg-slate-50"
        >
          <span className="flex-1">
            {option?.label ?? filter.key} :{' '}
            {ComponentView ? (
              <ComponentView
                operator={filter.operator}
                fiValue={filter.value}
              />
            ) : (
              printValue(filter.value)
            )}
          </span>
          <CircleX
            className="text-slate-500 w-4 h-4"
            onClickCapture={(e) => {
              e.stopPropagation()
              clearFilter(filter.key)
            }}
          />
        </div>
      </Popover>
    </div>
  )
}

function printValue(value: unknown): string {
  if (!value) return ''
  if (Array.isArray(value)) {
    return `${value[0].toString().slice(0, 10)} - ${value[1]
      .toString()
      .slice(0, 10)}`
  }
  if (typeof value == 'object') {
    return '...'
  }
  if (typeof value == 'string') {
    if (value.length > 10) {
      return value.slice(0, 10) + '...'
    }
    return value.toString().slice(0, 10)
  }
  return (value as number).toString()
}
