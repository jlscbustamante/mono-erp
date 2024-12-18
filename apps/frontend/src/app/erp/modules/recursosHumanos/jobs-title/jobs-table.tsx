import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { JobTitle } from 'pizzadb'

export const JobsTable = ({
  jobsTitle,
  loading,
}: {
  jobsTitle: JobTitle[]
  loading?: boolean
}) => {
  return (
    <Table
      size="small"
      bordered
      dataSource={jobsTitle}
      loading={loading}
      pagination={false}
      rowKey={(record) => record.id}
      columns={
        [
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Nombre',
            dataIndex: 'name',
          },
          {
            title: 'Descripción',
            dataIndex: 'description',
          },
        ] satisfies ColumnsType<JobTitle>
      }
    />
  )
}
