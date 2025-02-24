import type { WhereOption } from '@pizzadb'
import { CircleX, Plus, Search, X } from 'lucide-react'
import type React from 'react'

import { Button, Dropdown, Popover, Select } from 'antd'
import { FiDatePicker, FiRangeDatePicker } from './component/fi-date'
import { FiInput, FiInputNumber } from './component/fi-input'
import type { FilterComponentProps, FilterOption } from './type'

export function FilterComponent<T>({
  options = [],
  filters = [],
  setFilters,
  onSearch,
  loading,
}: {
  options?: FilterOption<T>[]
  filters?: WhereOption<T>[]
  setFilters?: (filters: WhereOption<T>[]) => void
  onSearch?: (filters: WhereOption<T>[]) => void
  loading?: boolean
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
    setFilters?.(filters.filter((el) => !keys.includes(el.key as keyof T)))
  }

  const clearFilter = (key: string) => {
    setFilters?.(filters.filter((el) => el.key != key))
  }

  return (
    <div className="flex gap-1 items-center">
      <Dropdown
        trigger={['click']}
        className="w-48"
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
        <Button size="middle" variant="outlined">
          <Plus /> Agregar filtro
        </Button>
      </Dropdown>
      <div className="flex flex-wrap gap-1">
        {filters.map((el) => {
          const option = options.find((opt) => opt.key == el.key)
          if (!option) return null
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
      <div className="flex items-center gap-1">
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
        <Button
          variant={'outlined'}
          key={filter.key}
          className="flex justify-between px-1 gap-2"
        >
          <span className="flex-1">
            {option?.label ?? filter.key}: {printValue(filter.value)}
          </span>
          <CircleX
            className="text-slate-500 w-4 h-4"
            onClickCapture={(e) => {
              e.stopPropagation()
              clearFilter(filter.key)
            }}
          />
        </Button>
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
