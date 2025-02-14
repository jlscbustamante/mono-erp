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
            sorter: (a, b) => a.id - b.id,
          },
          {
            title: 'Nombre',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
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
