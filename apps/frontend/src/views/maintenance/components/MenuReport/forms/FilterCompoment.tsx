import { DatePicker, Input, Popover, Select } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

import { mapKeyFilterMenuReport } from '@/data/maintenance/MenuReport/const/mapKeyFilterMenuReport'
import { IReport } from '@/data/reports/types'
import { OpFilter } from '@/data/types/Filters'
import { filterOption, optionsKeyFilter, safeAny, sliceText } from '@/utils'

export const FilterComponent: React.FC<{
  keyFilter: keyof IReport
  value: [OpFilter, ...safeAny[]]
  deleteFilter?: safeAny
  selection?: { label: string; value: safeAny }[]
  onChangeOption?: (val: [OpFilter, ...safeAny[]]) => void
}> = ({ keyFilter, value, deleteFilter, onChangeOption, selection }) => {
  const optionsFilters = optionsKeyFilter(mapKeyFilterMenuReport(keyFilter))
  const [filter, setFilter] = useState([value[0], value[1], value[2]])
  const isRange = filter[0] === OpFilter.Range
  const isRangeDate = filter[0] === OpFilter.RangeDate
  const onDelete = (e: any) => {
    e.stopPropagation()
    if (deleteFilter) deleteFilter()
  }

  const bodyInputs = (
    <>
      {filter[0] === OpFilter.EqualDate || isRangeDate ? (
        <DatePicker
          value={filter[1] ? dayjs(filter[1]) : null}
          onChange={(e: safeAny) =>
            setFilter([filter[0], e.format('YYYY-MM-DD'), filter[2]])
          }
        />
      ) : (
        <Input
          placeholder="valor"
          value={filter[1] ?? ''}
          onChange={(e) => setFilter([filter[0], e.target.value, filter[2]])}
        />
      )}
      {isRangeDate && (
        <DatePicker
          value={filter[2] ? dayjs(filter[2]) : null}
          onChange={(e: safeAny) =>
            setFilter([filter[0], filter[1], e.format('YYYY-MM-DD')])
          }
        />
      )}
      {isRange && (
        <Input
          placeholder="hasta"
          value={filter[2] ?? ''}
          onChange={(e) => setFilter([filter[0], filter[1], e.target.value])}
        />
      )}
    </>
  )
  const content = (
    <div style={{ width: 160 }} className="flex flex-col gap-2">
      <Select
        options={optionsFilters}
        bordered={false}
        value={filter[0]}
        onChange={(val) => {
          setFilter([val])
        }}
      />
      <div className="flex flex-col gap-1">
        {filter[0] === OpFilter.Select ? (
          <Select
            options={selection}
            bordered={false}
            placeholder="selecciona"
            showSearch
            filterOption={filterOption as safeAny}
            value={filter[1]}
            onChange={(val) => {
              setFilter([filter[0], val])
            }}
          />
        ) : filter[0] === OpFilter.SelectIn ? (
          <Select
            mode="multiple"
            allowClear
            filterOption={filterOption as safeAny}
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={['a10', 'c12']}
            onChange={(val) => {
              setFilter([filter[0], ...val])
            }}
            options={selection}
          />
        ) : (
          bodyInputs
        )}
      </div>
    </div>
  )
  return (
    <Popover
      content={content}
      placement="bottom"
      arrow={false}
      trigger={['click']}
      onOpenChange={(open) => {
        if (!open) {
          onChangeOption?.([filter[0], filter[1], filter[2]])
        }
      }}
    >
      <div className="cursor-pointer border border-dashed border-gray-300 items-center flex text-sm rounded-md px-1 gap-2 bg-slate-50">
        {filter[0] === OpFilter.Select ? (
          <span>
            {keyFilter} :{' '}
            {selection?.find((el: safeAny) => el.value == filter[1])?.label ??
              'sin seleccion'}
          </span>
        ) : filter[0] === OpFilter.SelectIn ? (
          <span>{keyFilter} : multiple</span>
        ) : (
          <span>
            {keyFilter} : {sliceText(value[1], 10)}{' '}
            {isRange || isRangeDate ? ` - ${value[2]}` : ''}
          </span>
        )}
        <AiOutlineCloseCircle onClickCapture={onDelete} />
      </div>
    </Popover>
  )
}
