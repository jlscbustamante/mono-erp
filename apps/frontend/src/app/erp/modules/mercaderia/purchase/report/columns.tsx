import { cn, fCurrency } from '@/utils'
import { ColumnsType } from 'antd/es/table'
import { format } from 'date-fns'

export interface RowTable {
  id: number
  num: string
  date: Date
  supplier: string
  type_doc: string
  num_doc: string
  item_name: string
  quantity: number
  price: number
  price_with_igv: string
  total: number
  total_fact: string
}

export const columns: ColumnsType<RowTable> = [
  {
    title: 'N°',
    dataIndex: 'num',
  },
  {
    title: 'FECHA',
    dataIndex: 'date',
    render: (value) => {
      if (!value) return ''
      return format(value, 'yyyy-MM-dd')
    },
  },
  {
    title: 'PROVEEDOR',
    dataIndex: 'supplier',
  },
  {
    title: 'DOC',
    dataIndex: 'type_doc',
  },
  {
    title: 'N° FACTURA',
    dataIndex: 'num_doc',
  },
  {
    title: 'PRODUCTO',
    dataIndex: 'item_name',
  },
  {
    title: 'CANTIDAD',
    dataIndex: 'quantity',
    align: 'right',
  },
  {
    title: 'COSTO',
    dataIndex: 'price',
    align: 'right',
  },
  {
    title: '1.18',
    dataIndex: 'price_with_igv',
    align: 'right',
    render: (value) => {
      if (!value) return ''
      return <p className="text-right">{fCurrency(value, false)}</p>
    },
  },
  {
    title: 'SUB SUMA',
    dataIndex: 'total',
    align: 'right',
    render: (value, record) => {
      if (!value) return ''
      const num = +value
      return (
        <span
          className={cn({
            'font-semibold': 'is_total' in record,
          })}
        >
          {fCurrency(num.toFixed(2))}
        </span>
      )
    },
  },
  {
    title: 'TOTAL FACT',
    dataIndex: 'total_fact',
    align: 'right',
    render: (value, record) => {
      if (!value) return ''
      return (
        <span
          className={cn({
            'font-semibold': 'is_total' in record,
          })}
        >
          {fCurrency(value)}
        </span>
      )
    },
  },
]
