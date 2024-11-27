import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo } from 'react'

import { Filters3, OpFilter } from '@/data/types/Filters'
import { useParametersQuery } from '@/hooks/useParamters'

import { ICourier } from '../types'
import { useCouriers } from '../useCouriers'
import { useCourierStore } from '../useStorePage'

export const TableCourier = ({
  columns,
}: {
  columns: ColumnsType<ICourier>
}) => {
  const { data } = useParametersQuery()
  const query = useCouriers(data?.ciaIdMoturider ?? null)
  const reload = useCourierStore((state) => state.reload)
  const filters = useCourierStore((state) => state.filters)

  const couriers = useMemo(() => {
    const filtered = applyFilters(query.data ?? [], filters)
    return filtered
  }, [reload, query.data])

  useEffect(() => {
    if (reload > 0) {
      query.refetch()
    }
  }, [reload])

  return (
    <>
      <Table
        rowKey={(record) => record.id.toString()}
        loading={query.isLoading || query.isFetching}
        columns={columns}
        dataSource={couriers}
        pagination={false}
        size="small"
      />
    </>
  )
}

const applyFilters = <T,>(couries: T[], filters: Filters3<T>): T[] => {
  let result = couries
  for (const key in filters) {
    const filter = filters[key as keyof T] as string[] | undefined
    if (!filter) continue
    const operator = filter[0] as OpFilter
    const values = filter
      .slice(1, filter.length)
      .filter((value) => value != undefined)
    if (values.length === 0) continue
    result = result.filter((courier) => {
      const value = courier[key] as string | undefined
      if (value != undefined) {
        return applyOperator(value, operator, values)
      }
      return false
    })
  }
  return result
}

const applyOperator = (
  value: string | number,
  operator: OpFilter,
  values: string[],
) => {
  switch (operator) {
    case OpFilter.Equal:
      return values.includes(value.toString())
    case OpFilter.Contain:
      return values.some((v) =>
        value.toString().toLowerCase().includes(v.toLowerCase()),
      )
    case OpFilter.Select:
      return values.includes(value as any)
    case OpFilter.SelectIn:
      return values.includes(value as any)
    default:
      return false
  }
}
