import { InputNumber, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'

import { StockItemToCreateDto } from '@/data/hex/types'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

export const TableEditStock = ({
  dataSource,
  setDataSource,
  isLoading,
}: {
  dataSource: StockItemToCreateDto[]
  setDataSource: (data: StockItemToCreateDto[]) => void
  isLoading?: boolean
}) => {
  const onChangeInput = (value: number, itemId: number) => {
    const newItmes = dataSource.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          stockPhysical: value,
          totalValue: value * item.unitValue,
        }
      }
      return item
    })
    setDataSource(newItmes)
  }
  const columns: ColumnsType<StockItemToCreateDto> = [
    {
      title: 'Categoria',
      dataIndex: 'categoryName',
      sorter: (a, b) => a.categoryName?.localeCompare(b.categoryName ?? ''),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Id',
      dataIndex: 'itemId',
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: 'I. inicial',
      dataIndex: 'initialStock',
      render: (num) => fNumber(num, 3),
    },
    {
      dataIndex: 'quantityInPurchase',
      title: 'Compra',
      render: (num) => fNumber(num, 3),
      sorter: (a: any, b: any) => a.quantityInPurchase - b.quantityInPurchase,
    },
    {
      dataIndex: 'quantityOutDispatch',
      title: 'Despacho',
      render: (num) => fNumber(num, 3),
      sorter: (a: any, b: any) => a.quantityOutDispatch - b.quantityOutDispatch,
    },
    {
      title: 'Teórico',
      dataIndex: 'stockCurrent',
      render: (num) => fNumber(num, 3),
    },
    {
      title: 'Fisico',
      dataIndex: 'stockPhysical',
      sorter: (a: any, b: any) => a.stockPhysical - b.stockPhysical,
      render: (num, record) => {
        return (
          <InputNumber
            value={num}
            precision={3}
            // onChange={(val) => (val ? onChangeInput(val, record.itemId) : null)}
            onChange={(val) => {
              if (val == null || val == undefined) return
              onChangeInput(val, record.itemId)
            }}
          />
        )
      },
    },
    {
      title: 'C.U',
      dataIndex: 'unitValue',
      render: (num) => fNumber(num, 2),
    },
    {
      title: 'C.T',
      dataIndex: 'totalValue',
      width: 120,
      render: (num) => fCurrency(num, false),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      size="small"
      rowKey={'item_id'}
      pagination={false}
      loading={isLoading == true}
    />
  )
}
