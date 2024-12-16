import { Table } from 'antd'
import { useAsistenciaContext } from '.'

export const AttendanceTable = () => {
  const { data, columns, isLoading } = useAsistenciaContext()
  // return <div>{JSON.stringify(data)}</div>
  return (
    <Table
      loading={isLoading}
      dataSource={data}
      rowKey={(record) => record.id}
      size="small"
      pagination={false}
      bordered
      columns={columns}
    />
  )
}
