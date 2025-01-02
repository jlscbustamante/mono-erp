import { cn } from '@/utils'
import { Button, Dropdown, Select } from 'antd'
import { MenuProps } from 'antd/lib'
import { WhereOption } from 'pizzadb'
import { useMemo } from 'react'
import { FiInput } from './components/input'
import { FiInputNumber } from './components/input-number'
import { FiRangePicker } from './components/range'
import { ComponentFiRender, FilterOption } from './types'

interface IItem<U> {
  filter: WhereOption<U>
  option: FilterOption<U>
}

const availableComponents: Record<
  string,
  (props: ComponentFiRender) => JSX.Element
> = {
  default: FiInput as any,
  range: FiRangePicker,
  num: FiInputNumber as any,
}

export const FillimeSelector = <T = unknown,>({
  options = [],
  filters = [],
  addFilter,
  removeFilter,
  modFilter,
}: {
  options?: FilterOption<T>[]
  filters?: WhereOption<T>[]
  addFilter?: (data: WhereOption<T>) => void
  removeFilter?: (data: WhereOption<T>) => void
  modFilter?: (data: WhereOption<T>) => void
}) => {
  const items: MenuProps['items'] = options.map((el) => {
    return {
      key: el.index.toString(),
      label: el.title,
      onClick: () => {
        addFilter?.({
          field: el.index,
          operator: el.options?.[0] ?? 'equal',
          value: el.default ?? undefined,
        })
      },
    }
  })

  const availableFilters: IItem<T>[] = useMemo(() => {
    const data: IItem<T>[] = []

    for (const el of filters) {
      const opt = options.find((option) => option.index == el.field)
      if (opt)
        data.push({
          filter: el,
          option: opt as any,
        })
    }

    return data
  }, [items, filters])

  return (
    <div>
      <div>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button size="small" className="w-52">
            Agregar filtros
          </Button>
        </Dropdown>
      </div>
      <div className="space-y-1 my-2">
        {availableFilters.map((el) => {
          const Component = availableComponents[el.option.type ?? 'default']

          return (
            <div
              key={el.filter.field.toString()}
              className={cn('border border-solid border-slate-400', {
                hidden: el.option.hide,
              })}
            >
              <span>{el.option.title}</span>
              <Select
                size="small"
                className="w-40"
                value={el.filter.operator}
                onChange={(val) => {
                  modFilter?.({
                    ...el.filter,
                    operator: val,
                  })
                }}
              >
                {el.option.options?.map((option) => {
                  return <Select.Option key={option}>{option}</Select.Option>
                })}
              </Select>
              <Component
                {...el.option.props}
                filValue={el.filter.value as string}
                onFilChange={(val: any) => {
                  modFilter?.({
                    ...el.filter,
                    value: val,
                  })
                }}
              />
              <div
                className={cn({ 'text-slate-600': el.option.noAllowClear })}
                onClick={() => {
                  if (!el.option.noAllowClear) removeFilter?.(el.filter)
                }}
              >
                remover
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
