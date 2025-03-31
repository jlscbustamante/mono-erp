import { cn, fCurrency } from '@/utils'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { format } from 'date-fns'
import { useState } from 'react'
import '../../../../../../views/products/dispatch/style-prin.css'
import { RowTable } from './columns'
import './style.css'

export const TableReport = ({
  data,
  total,
  ref_table,
}: {
  data: RowTable[]
  total: number
  ref_table: any
}) => {
  const [invoice_selected, set_invoice_selected] = useState('')

  const columns: ColumnsType<RowTable> = [
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
      onCell: (record) => {
        if (invoice_selected == record.num_doc) {
          return {
            style: {
              background: 'hsl(228, 100.00%, 91.00%)',
            },
          }
        }
        return {}
      },
      render: (val) => {
        return <span>{val}</span>
      },
    },
    {
      title: 'CATEGORIA',
      dataIndex: 'category_name',
      sorter: (a, b) =>
        a.category_name?.localeCompare(b.category_name ?? '') ?? 1,
    },
    {
      title: 'ITEM',
      dataIndex: 'item_name',
      sorter: (a, b) => a.item_name?.localeCompare(b.item_name ?? '') ?? 1,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'quantity',
      align: 'right',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'U.M',
      dataIndex: 'unit_measure',
    },

    {
      title: 'COSTO',
      dataIndex: 'price',
      align: 'right',
      render: (val) => {
        if (!val) return ''
        return <p className="text-right">{fCurrency(val, true)}</p>
      },
    },
    {
      title: '1.18',
      dataIndex: 'price_with_igv',
      align: 'right',
      render: (value) => {
        if (!value) return ''
        return <p className="text-right">{fCurrency(value, true)}</p>
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

  return (
    <div ref={ref_table} className="print:p-3">
      <Table
        className="table-items-to-print"
        bordered={true}
        pagination={false}
        size="small"
        onRow={(record) => {
          return {
            onClick: () => {
              set_invoice_selected(record.num_doc)
            },
            // onMouseEnter: () => {
            //   set_invoice_selected(record.num_doc)
            // },
            // style: {
            //   // background: 'rgb(220, 245, 255)',
            //   background:
            //     invoice_selected == record.num_doc ? 'rgb(220, 245, 255)' : '',
            // },
          }
        }}
        dataSource={data}
        // dataSource={
        //   [
        //     ...data,
        //     {
        //       total: total,
        //       is_total: true,
        //       total_fact: total,
        //     },
        //   ] as RowTable[]
        // }
        columns={columns}
        footer={() => {
          return (
            <div className="font-semibold text-right">
              TOTAL : {fCurrency(total)}
            </div>
          )
        }}
        rowKey={(el) => el.id}
      />
    </div>
  )
}
