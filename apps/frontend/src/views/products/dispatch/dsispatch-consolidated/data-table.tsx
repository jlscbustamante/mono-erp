import { DispatchSummary } from '@/data/hex/types'
import { fNumber } from '@/utils/formatNumber'
import { Table } from 'antd'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { useMemo } from 'react'
import { useConsolidateByStore } from './consolidated-by-store-drawer'

export const DispatchConsolidatedTable = ({
  data,
  tableRef,
  categoriesSelected,
}: {
  data: { dispatches: DispatchSummary[]; dates: [string, string] }
  tableRef: any
  categoriesSelected: string[]
}) => {
  const { open } = useConsolidateByStore()

  const datesFormated: { iso: string; formated: string }[] = useMemo(() => {
    const dates = data.dates
    const allDays = eachDayOfInterval({
      start: parseISO(dates[0]),
      end: parseISO(dates[1]),
    })
    return allDays.map((date) => ({
      iso: format(date, 'yyyy-MM-dd'),
      formated: format(date, 'dd/MM'),
    }))
  }, [data])

  const tableData = useMemo(() => {
    const grouped = data.dispatches.reduce(
      (acc, item) => {
        const category = acc.find(
          (cat) => cat.categoryName === item.categoryName,
        )
        if (category) {
          category.items.push(item)
        } else {
          acc.push({ categoryName: item.categoryName, items: [item] })
        }
        return acc
      },
      [] as { categoryName: string; items: DispatchSummary[] }[],
    )
    const result = grouped.flatMap((group) => {
      const grouped = group.items.map((item, index) => ({
        ...item,
        categoryName: index === 0 ? group.categoryName : '',
        items: group.items.length,
        categoryId: item.categoryId,
      }))
      return grouped
    })
    if (categoriesSelected.length == 0) {
      return result
    } else {
      return result.filter((el) =>
        [...categoriesSelected.map((el) => el + ''), '0'].includes(
          el.categoryId + '',
        ),
      )
    }
  }, [data, categoriesSelected])

  const date = useMemo(() => {
    return `${data.dates[0]} - ${data.dates[1]}`
  }, [data])

  return (
    <div ref={tableRef} className="print:py-2 print:px-3">
      <p className="hidden print:block font-semibold text-sm">
        DESPACHO CONSOLIDADO {date}
      </p>
      <Table
        className="table-items-to-print"
        rowKey={'itemId'}
        bordered={true}
        dataSource={tableData}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Categoria',
            dataIndex: 'categoryName',
            onCell: (record) => ({
              rowSpan: record.categoryName ? (record as any).items : 0,
            }),
          },
          {
            title: 'Item',
            dataIndex: 'itemName',
          },
          ...datesFormated.map((date) => ({
            title: date.formated,
            className: 'w-20',
            render: (_: unknown, record: DispatchSummary) => {
              const value = record.dates[date.iso] ?? 0
              const onlyDate = date.iso
              const itemId = record.itemId
              const itemName = record.itemName
              return (
                <p
                  className="cursor-pointer hover:text-blue-600 hover:underline"
                  onClick={() => {
                    open({ itemId, date: onlyDate, itemName })
                  }}
                >
                  {fNumber(value, 2)}
                </p>
              )
              // return fNumber(value, 2)
            },
          })),
          {
            title: 'Total',
            className: 'w-20 bg-neutral-200',
            render: (_: unknown, record: DispatchSummary) => {
              const total = Object.values(record.dates).reduce(
                (a, b) => a + b,
                0,
              )
              return fNumber(total, 2)
            },
          },
        ]}
      />
    </div>
  )
}
