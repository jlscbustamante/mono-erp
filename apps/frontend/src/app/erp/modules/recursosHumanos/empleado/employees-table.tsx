import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { RhEmployee } from 'pizzadb'
import { useFilterEmployees } from './state'

export const EmployeesTable = () => {
  const query = useFilterEmployees()

  return (
    <div className="">
      <Table
        rowKey={(record) => record.id}
        bordered
        pagination={false}
        size="small"
        loading={query.isLoading}
        dataSource={query.data?.data}
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
            },
            {
              title: 'Nombre',
              render: (_, record: RhEmployee) => {
                return `${record.first_name} ${record.last_name}`
              },
            },
            {
              title: 'Doc.',
              dataIndex: 'doc_number',
            },
            {
              title: 'Telefono',
              dataIndex: 'phone',
            },
            {
              title: 'Email',
              dataIndex: 'email',
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              render: (status) => (status == 1 ? 'Activo' : 'Inactivo'),
            },
          ] satisfies ColumnsType<RhEmployee>
        }
      />
    </div>
  )
}
