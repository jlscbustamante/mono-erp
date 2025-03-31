import { Button, DatePicker, Input, Popover, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdOutlineCleaningServices } from 'react-icons/md'

import { Filters3, OpFilter } from '@/data/types/Filters'
import { cn, filterOption, optionsKeyFilter, safeAny, sliceText } from '@/utils'
import { OpFilter as OpFilter2 } from 'shared'

type FilterOptions = {
  label: string
  key: string
  options: OpFilter[]
  selection?: { label: string; value: string | number }[]
  nodelete?: boolean
}

export interface FiltersOption<T> {
  label: string
  key: keyof T
  options: OpFilter2[]
  selection?: { label: string; value: safeAny }[]
  nodelete?: boolean
}

interface IComponentProps<T> {
  userFilters?: Filters3<T>
  setUserFilters?: (newFilters: Filters3<T>) => void
  options: FilterOptions[]
  rootClass?: string
  selections?: { [key: string]: { label: string; value: safeAny }[] }
  ignore?: (keyof T)[]
  cleanAllButton?: boolean
}
const RangePicker = DatePicker.RangePicker

export const ShowFilters = <T,>(props: IComponentProps<T>) => {
  return (
    <div className={props.rootClass ?? ''}>
      {props.userFilters &&
        Object.keys(props.userFilters)
          .filter((key) => !props.ignore?.includes(key as keyof T))
          .filter((key) => props.userFilters?.[key as keyof T])
          .map((key: safeAny) => {
            return (
              <FilterComponent
                key={key}
                options={props.options}
                filter={props.userFilters?.[key as keyof T]}
                keyFilter={key}
                selections={props.selections}
                onChangeFilter={(value, key) => {
                  props.setUserFilters?.({
                    ...props.userFilters,
                    [key]: value,
                  })
                }}
                onDelete={(key) => {
                  props.setUserFilters?.({
                    ...props.userFilters,
                    [key]: undefined,
                  })
                }}
              />
            )
          })}
      {Object.keys(props.userFilters ?? {}).filter(
        (key) => props.userFilters?.[key as keyof T],
      ).length > 1 &&
        props.cleanAllButton && (
          <Button
            title="Quitar todos los filtros"
            onClick={() => {
              props.setUserFilters?.({})
            }}
            icon={<MdOutlineCleaningServices />}
            type="primary"
          ></Button>
        )}
    </div>
  )
}

const FilterComponent: React.FC<{
  options: FilterOptions[]
  filter: safeAny
  keyFilter: string
  onChangeFilter?: (value: [OpFilter, ...safeAny[]], key: safeAny) => void
  onDelete?: (key: safeAny) => void
  selections?: { [key: string]: { label: string; value: safeAny }[] }
  largeSelect?: boolean
}> = ({ options, filter, keyFilter, onChangeFilter, onDelete, selections }) => {
  const element = options.find((el) => el.key === keyFilter)
  const label = element?.label
  const [filters, setFilter] = useState<[OpFilter, ...safeAny[]]>(filter)
  const [openPop, setOpenPop] = useState(false)

  const getContent = (val: OpFilter) => {
    if (!element) return
    switch (val) {
      case OpFilter.NotNull:
      case OpFilter.IsNull:
      case OpFilter.lastMonth:
      case OpFilter.lastWeek:
        return <span></span>
      case OpFilter.Select:
        return (
          <Select
            // bordered={false}
            variant="outlined"
            placeholder="selecciona"
            filterOption={filterOption as safeAny}
            showSearch
            options={element.selection ?? selections?.[keyFilter] ?? []}
            value={filters[1]}
            className="w-full"
            onChange={(val) => {
              setFilter([filters[0], val])
            }}
          />
        )
      case OpFilter.SelectIn:
        return (
          <Select
            mode="multiple"
            allowClear
            filterOption={filterOption as safeAny}
            style={{ width: '100%' }}
            placeholder="Multiple"
            className="w-full"
            value={filters.slice(1).filter((el) => Boolean(el))}
            onChange={(val) => {
              setFilter([filters[0], ...val])
            }}
            options={element.selection ?? selections?.[keyFilter] ?? []}
          />
        )
      case OpFilter.Range:
        return (
          <>
            <Input
              placeholder="desde"
              value={filters[1]}
              className="w-full"
              onChange={(e) =>
                setFilter([filters[0], e.target.value, filters[2]])
              }
            />
            <Input
              placeholder="hasta"
              value={filters[2]}
              className="w-full"
              onChange={(e) =>
                setFilter([filters[0], filters[1], e.target.value])
              }
              onKeyDown={(e: safeAny) => {
                if (e.key === 'Enter') {
                  setOpenPop(false)
                }
              }}
            />
          </>
        )
      case OpFilter.RangeDate:
        return (
          <RangePicker
            allowClear={false}
            placeholder={['desde', 'hasta']}
            value={
              filters
                .slice(1, 3)
                .map((el) => (el ? dayjs(el) : null)) as safeAny
            }
            onChange={(e) => {
              setFilter([
                filters[0],
                e?.[0]?.format('YYYY-MM-DD'),
                e?.[1]?.format('YYYY-MM-DD'),
              ])
            }}
          />
        )
      case OpFilter.EqualDate:
        return (
          <DatePicker
            className="w-full"
            placeholder="desde"
            value={filters[1] ? dayjs(filters[1]) : null}
            onChange={(e) => setFilter([filters[0], e?.format('YYYY-MM-DD')])}
            allowClear={false}
          />
        )
      default:
        return (
          <Input
            placeholder="..."
            value={filters[1]}
            onChange={(e) => setFilter([val, e.target.value])}
            onKeyDown={(e: safeAny) => {
              if (e.key === 'Enter') {
                setOpenPop(false)
              }
            }}
          />
        )
    }
  }

  useEffect(() => {
    if (!openPop) {
      if (filter.toString() == filters.toString()) return
      onChangeFilter?.(filters, keyFilter)
    }
  }, [openPop])
  return (
    <Popover
      open={openPop}
      onOpenChange={(open) => {
        setOpenPop(open)
      }}
      trigger={['click']}
      placement="bottom"
      content={
        <div
          style={{
            width:
              filters[0] == OpFilter.RangeDate
                ? '240px'
                : keyFilter == 'item_id'
                  ? '360px'
                  : '190px',
          }}
        >
          <Select
            options={optionsKeyFilter(element?.options ?? [])}
            value={filters?.[0]}
            onChange={(val) => {
              setFilter([val, ...filters.slice(1)])
            }}
            // bordered={false}
            variant="borderless"
            style={{ minWidth: '100px' }}
          />
          {getContent(filters[0])}
        </div>
      }
    >
      <div
        className="cursor-pointer border border-dashed border-gray-300 items-center flex text-sm rounded-md px-1 gap-2 bg-slate-50"
        style={{ width: 'max-content' }}
      >
        <TitleFilter
          title={label ?? 'No definido'}
          filter={filters}
          selection={element?.selection ?? selections?.[keyFilter] ?? []}
        />
        <AiOutlineCloseCircle
          // className={}
          className={cn({
            hidden: element?.nodelete,
          })}
          onClickCapture={(e: any) => {
            e.stopPropagation()
            onDelete?.(keyFilter)
          }}
        />
      </div>
    </Popover>
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
