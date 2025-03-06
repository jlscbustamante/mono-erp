import { DatePicker, Input, Popover, Select } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

import { OpFilter } from '@/data/types/Filters'
import { safeAny, filterOption as selectFilterOption, sliceText } from '@/utils'

const { RangePicker } = DatePicker

type Selection = { label: string; value: safeAny }

interface IComponentProps<T> {
  keyFilter: keyof T
  title: string
  value: [OpFilter, ...safeAny[]]
  onDelete?: (key: keyof T) => void
  onChange?: (val: [OpFilter, ...safeAny[]], key: keyof T) => void
  selection?: Selection[]
  filterOptions: Selection[]
}
export const FilterComponent = <T,>(props: IComponentProps<T>) => {
  const [filter, setFilter] = useState<[OpFilter, ...safeAny[]]>([
    props.value[0],
    props.value[1],
    props.value[2],
  ])
  const [open, setOpen] = useState(false)

  return (
    <Popover
      trigger={['click']}
      placement="bottom"
      open={open}
      arrow={false}
      onOpenChange={(open) => {
        if (!open) {
          props.onChange?.(filter, props.keyFilter)
          setOpen(false)
        }
      }}
      content={
        <EditFilter
          filter={filter}
          setFilter={setFilter}
          selections={props.selection}
          onChangeFilter={(val: OpFilter) => {
            setFilter([val, ...filter.slice(1)])
          }}
          filterOptions={props.filterOptions}
          onApplyFilter={() => {
            props.onChange?.(filter, props.keyFilter)
            // props.onApplyFilter?.()
            setOpen(false)
          }}
        />
      }
    >
      <div
        className="cursor-pointer border border-dashed border-gray-300 items-center flex text-sm rounded-md px-1 gap-2 bg-slate-50"
        onClick={() => setOpen(!open)}
      >
        <TitleFilter
          title={props.title}
          filter={filter}
          selection={props.selection}
        />
        <AiOutlineCloseCircle
          onClickCapture={(e: any) => {
            e.stopPropagation()
            props.onDelete?.(props.keyFilter)
          }}
        />
      </div>
    </Popover>
  )
}

const EditFilter: React.FC<{
  filter: [OpFilter, ...safeAny[]]
  setFilter: (val: [OpFilter, ...safeAny[]]) => void
  selections?: Selection[]
  onChangeFilter: (val: OpFilter) => void
  filterOptions: Selection[]
  onApplyFilter?: () => void
}> = ({
  filter,
  selections,
  onChangeFilter,
  filterOptions,
  setFilter,
  onApplyFilter,
}) => {
  const onEnterInput = () => {
    onApplyFilter?.()
  }

  const getContent = (val: OpFilter) => {
    switch (val) {
      case OpFilter.NotNull:
      case OpFilter.IsNull:
      case OpFilter.lastMonth:
      case OpFilter.lastWeek:
        return <span></span>
      case OpFilter.Select:
        return (
          <Select
            variant="borderless"
            filterOption={selectFilterOption as safeAny}
            placeholder="selecciona"
            showSearch
            options={selections}
            value={filter[1]}
            className="w-full"
            onChange={(val) => {
              setFilter([filter[0], val])
            }}
          />
        )
      case OpFilter.SelectIn:
        return (
          <Select
            mode="multiple"
            allowClear
            filterOption={selectFilterOption as safeAny}
            style={{ width: '100%' }}
            placeholder="Multiple"
            className="w-full"
            value={filter.slice(1).filter((el) => Boolean(el))}
            onChange={(val) => {
              setFilter([filter[0], ...val])
            }}
            options={selections}
          />
        )
      case OpFilter.Range:
        return (
          <>
            <Input
              placeholder="desde"
              value={filter[1]}
              className="w-full"
              onChange={(e) =>
                setFilter([filter[0], e.target.value, filter[2]])
              }
            />
            <Input
              placeholder="hasta"
              value={filter[2]}
              className="w-full"
              onChange={(e) =>
                setFilter([filter[0], filter[1], e.target.value])
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEnterInput()
                }
              }}
            />
          </>
        )
      case OpFilter.RangeDate:
        return (
          <RangePicker
            placeholder={['desde', 'hasta']}
            value={
              filter.slice(1, 3).map((el) => (el ? dayjs(el) : null)) as safeAny
            }
            onChange={(e) => {
              setFilter([
                filter[0],
                e?.[0]?.format('YYYY-MM-DD'),
                e?.[1]?.format('YYYY-MM-DD'),
              ])
            }}
          />
        )
      case OpFilter.EqualDate:
        return (
          <DatePicker
            placeholder="desde"
            value={dayjs(filter[1])}
            onChange={(e) =>
              setFilter([filter[0], e?.format('YYYY-MM-DD'), filter[2]])
            }
          />
        )
      default:
        return (
          <Input
            placeholder="..."
            value={filter[1]}
            onChange={(e) => setFilter([val, e.target.value])}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEnterInput()
              }
            }}
          />
        )
    }
  }

  return (
    <div
      style={{ width: filter[0] == OpFilter.RangeDate ? 300 : 180 }}
      className="flex flex-col gap-2"
    >
      <Select
        variant="borderless"
        options={filterOptions}
        value={filter[0]}
        onChange={(val) => {
          onChangeFilter(val)
        }}
      />
      <div className="w-full">{getContent(filter[0])}</div>
    </div>
  )
}

const TitleFilter: React.FC<{
  title: string
  filter: [OpFilter, ...safeAny[]]
  selection?: { label: string; value: safeAny }[]
}> = ({ title, filter, selection }) => {
  switch (filter[0]) {
    case OpFilter.Select:
      return (
        <span>
          {title} :{' '}
          {selection?.find((el) => el.value == filter[1])?.label ??
            'sin seleccion'}
        </span>
      )
    case OpFilter.SelectIn:
      return <span>{title} : multiple</span>
    case OpFilter.Range:
    case OpFilter.RangeDate:
      return (
        <span>
          {title} : {filter[1]} - {filter[2]}
        </span>
      )
    case OpFilter.lastMonth:
      return <span>{title} : Ultimo mes</span>
    case OpFilter.lastWeek:
      return <span>{title} : Ultima semana</span>
    default:
      return (
        <span>
          {title} : {sliceText(filter[1], 10)}
        </span>
      )
  }
}
