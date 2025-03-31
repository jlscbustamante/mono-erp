import { Table } from 'antd'
import '../../../../../../views/products/dispatch/style-prin.css'
import { columns, RowTable } from './columns'

export const TableReport = ({
  data,
  total,
  ref_table,
}: {
  data: RowTable[]
  total: number
  ref_table: any
}) => {
  return (
    <div ref={ref_table} className="print:p-3">
      <Table
        className="table-items-to-print"
        bordered={true}
        pagination={false}
        size="small"
        dataSource={
          [
            ...data,
            {
              total: total,
              is_total: true,
              total_fact: total,
            },
          ] as RowTable[]
        }
        columns={columns}
        rowKey={(el) => el.id}
      />
    </div>
  )
}
