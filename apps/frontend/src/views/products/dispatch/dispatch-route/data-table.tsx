import { DispatchRoute } from '@/data/hex/types'
import { fNumber } from '@/utils/formatNumber'
import { Checkbox, Table, Typography } from 'antd'
import { useMemo, useState } from 'react'

interface GroupedByStore {
  countByStore: Record<string, number>
  dispatchId: number
  itemName: string
  shortItemName: string
  categoryId: number
  categoryName: string
  itemId: number
  measureCode: string
}

// const colums = DISPATCH_ROUTES.map(
//   (el) =>
//     ({
//       title: el,
//       render: (_, record: Grouped) =>
//         record.countByRoute[el] ? fNumber(record.countByRoute[el], 3) : '0.000',
//     }) satisfies ColumnType<Grouped>,
// )

export const DataTable = ({
  dispatches,
  tableRef,
  categoriesSelected,
}: {
  dispatches: DispatchRoute[]
  tableRef: any
  categoriesSelected: string[]
}) => {
  const [showLargeName, setHideUnused] = useState(false)
  const [showUnused, setShowUnused] = useState(false)

  const storeGrouped: GroupedByStore[] = useMemo(() => {
    const grouped: Record<string, GroupedByStore> = {}
    for (const dispatch of dispatches) {
      for (const item of dispatch.items) {
        // const route = dispatch.route != '' ? dispatch.route : 'no definido'
        const store =
          dispatch.wareToId != '' ? dispatch.wareToId : 'no definido'
        if (!grouped[item.itemName]) {
          const nameSplited = item.itemName.split('-').map((el) => el.trim())
          const shortName =
            nameSplited[0] + ' - ' + nameSplited[nameSplited.length - 1]
          grouped[item.itemName] = {
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            dispatchId: dispatch.id,
            itemName: item.itemName,
            itemId: item.itemId,
            shortItemName: shortName,
            measureCode: item.measureCode,
            countByStore: {
              [store]: item.quantity,
            },
          }
        } else {
          if (!grouped[item.itemName].countByStore[store]) {
            grouped[item.itemName].countByStore[store] = item.quantity
          } else {
            grouped[item.itemName].countByStore[store] += item.quantity
          }
        }
      }
    }

    const sorted = Object.keys(grouped)
      .sort()
      .map((key) => grouped[key])

    if (categoriesSelected.length > 0) {
      return sorted.filter((el) =>
        [...categoriesSelected, '0', 'no definido'].includes(
          el.categoryId as any,
        ),
      )
    } else {
      return sorted
    }
  }, [dispatches, categoriesSelected])

  const columns = useMemo(() => {
    const uniqueWarehouses = dispatches.reduce(
      (acc, item) => {
        const hasAlready = acc.find((el) => el.name === item.wareToName)
        if (!hasAlready) {
          acc.push({ name: item.wareToName, id: item.wareToId })
        }
        return acc
      },
      [] as { name: string; id: string }[],
    )

    const columsUnique = uniqueWarehouses
      .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
      .map((el) => ({
        title: () => <Typography.Text className="">{el.name}</Typography.Text>,
        className: 'w-16 col-basic-print',
        key: el.id,
        // className: cn('print:w-10 bg-red-400!'),
        // align: 'center',
        render: (_: unknown, record: GroupedByStore) =>
          record.countByStore[el.id]
            ? fNumber(record.countByStore[el.id], 2)
            : '0.00',
      }))

    if (!showUnused) {
      return columsUnique
    } else {
      const filtered = columsUnique.filter((col) => {
        const isEmpty = storeGrouped.every(
          (el) => !el.countByStore[col.key] || el.countByStore[col.key] === 0,
        )
        return !isEmpty
      })
      return filtered
    }
  }, [storeGrouped, showUnused, categoriesSelected])

  const date = useMemo(() => {
    return dispatches.find((el) => el.dispatchAt)?.dispatchAt
  }, [dispatches])

  return (
    <div className="mt-3 space-y-2">
      <div className="flex text-sm gap-2 items-center">
        <label className="flex items-center gap-1">
          <Checkbox
            checked={showLargeName}
            onChange={(val) => setHideUnused(val.target.checked)}
          />
          Mostrar nombre del item completo
        </label>
        <label className="flex items-center gap-1">
          <Checkbox
            checked={showUnused}
            onChange={(val) => setShowUnused(val.target.checked)}
          />
          Ocultar tiendas vacias
        </label>
      </div>
      <div className="print:py-2 print:px-3" ref={tableRef}>
        <p className="hidden print:block font-semibold text-sm">
          DESPACHOS POR RUTA {date}
        </p>
        <Table
          pagination={false}
          size="small"
          dataSource={storeGrouped}
          className="table-items-to-print"
          bordered={true}
          scroll={{ x: 'max-content' }}
          columns={[
            {
              key: 'itemName',
              title: 'ITEM',
              render: (_: unknown, record: GroupedByStore) => (
                <p className="print:w-72 text-[13px] print:text-[10px]">
                  {showLargeName ? record.itemName : record.shortItemName}
                </p>
              ),
              // render: (text) => {
              //   const splited = text.split('-')
              //   return `${splited[0].trim()} - ${splited[
              //     splited.length - 1
              //   ].trim()}`
              // },
              fixed: 'left',
            },
            ...columns,
            {
              title: 'Total',
              className: 'w-14 print:w-10 bg-neutral-200',
              render: (_, record) => {
                const values = Object.values(record.countByStore).reduce(
                  (a, b) => a + b,
                  0,
                )
                return fNumber(values, 2)
              },
            },
          ]}
        />
      </div>
    </div>
  )
}
