import { cn } from '@/utils'
import { Button, Dropdown, Popover, Select } from 'antd'
import { MenuProps } from 'antd/lib'
import { CircleX } from 'lucide-react'
import { WhereOption } from 'pizzadb'
import { useMemo } from 'react'
import { FiDatePicker } from './components/date'
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
  date: FiDatePicker,
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
  const items: MenuProps['items'] = options
    .map((el) => {
      if (el.hide) return null
      const operator = el.options?.[0] ?? 'equal'
      let defaultValue = undefined
      if (el.defaultByOp) {
        defaultValue = el.defaultByOp[operator] ?? undefined
      } else if (el.default) {
        defaultValue = el.default
      }

      return {
        key: el.index.toString(),
        label: el.title,
        onClick: () => {
          addFilter?.({
            field: el.index,
            operator: operator,
            value: defaultValue,
            useMod: el.useMod,
            mods: el.mods,
          })
        },
      }
    })
    .filter((el) => el)

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
    <div className="flex gap-2 items-center">
      <div>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button className="w-52">Agregar filtros</Button>
        </Dropdown>
      </div>
      <div className="flex items-center gap-1">
        {availableFilters.map((el) => {
          const Component =
            el.option.render ?? availableComponents[el.option.type ?? 'default']
          const ComponentView = el.option.view
          const props = el.option.render ? {} : el.option.props

          const content = (
            <div
              key={el.filter.field.toString()}
              className={cn('max-w-xl flex flex-col gap-2 items-start')}
            >
              {/* <span>{el.option.title}</span> */}
              <Select
                size="small"
                className="w-40"
                value={el.filter.operator}
                onChange={(val) => {
                  let defaultValue = undefined
                  if (el.option.defaultByOp) {
                    defaultValue = el.option.defaultByOp[val] ?? undefined
                  } else if (el.option.default) {
                    defaultValue = el.option.default
                  }
                  modFilter?.({
                    ...el.filter,
                    value: defaultValue,
                    operator: val,
                  })
                }}
              >
                {el.option.options?.map((option) => {
                  return (
                    <Select.Option key={option}>
                      {OperatorName[option] ?? option}
                    </Select.Option>
                  )
                })}
              </Select>
              <Component
                {...props}
                operator={el.filter.operator}
                filValue={el.filter.value as string}
                onFilChange={(val: any) => {
                  modFilter?.({
                    ...el.filter,
                    value: val,
                  })
                }}
              />
              <div
                className={cn('text-blue-600 cursor-pointer', {
                  'text-slate-600': el.option.noAllowClear,
                  hidden: el.option.noAllowClear,
                })}
                onClick={() => {
                  if (!el.option.noAllowClear) removeFilter?.(el.filter)
                }}
              >
                remover filtro
              </div>
            </div>
          )

          return (
            <Popover
              content={content}
              trigger={'click'}
              key={el.filter.field.toString()}
              placement="bottom"
            >
              <Button size="small">
                {el.option.title}
                {' : '}
                {ComponentView ? (
                  <ComponentView value={el.filter.value} />
                ) : (
                  formatValue(el.filter.value)
                )}
                <CircleX
                  className={cn('w-4 h-auto text-slate-600 cursor-pointer', {
                    hidden: el.option.noAllowClear,
                  })}
                  onClickCapture={(ev) => {
                    ev.stopPropagation()
                    if (!el.option.noAllowClear) removeFilter?.(el.filter)
                  }}
                />
              </Button>
            </Popover>
          )
        })}
      </div>
    </div>
  )
}

const formatValue = (value: unknown) => {
  if (typeof value == 'string') {
    return value.length > 10 ? value.substring(0, 10) + '...' : value
  }
  if (typeof value == 'number') {
    return value.toString().length > 8
      ? value.toString().substring(0, 8) + '...'
      : value
  }
  if (Array.isArray(value)) {
    // si es 2 retornar los 2
    if (value.length <= 2) {
      return `${value.join(',')}`
    } else {
      return `${value[0]},${value[1]}...`
    }
  }
}

const OperatorName: Record<string, string> = {
  equal: 'igual',
  range: 'rango',
  select: 'seleccion',
  multiple: 'multiple',
  in: 'multiple',
  isNull: 'es nulo',
}
