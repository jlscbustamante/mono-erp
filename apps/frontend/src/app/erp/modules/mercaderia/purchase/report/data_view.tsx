import { Table } from 'antd'
import { columns, RowTable } from './columns'

export const TableReport = ({
  data,
  total,
}: {
  data: RowTable[]
  total: number
}) => {
  return (
    <div>
      <Table
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
