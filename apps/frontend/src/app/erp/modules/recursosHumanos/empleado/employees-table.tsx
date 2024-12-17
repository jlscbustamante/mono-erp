import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { RhEmployee } from 'pizzadb'
import { MdEdit } from 'react-icons/md'
import { useEditEmployee } from './edit-employee-drawer'
import { useFilterEmployees } from './state'

export const EmployeesTable = () => {
  const query = useFilterEmployees()
  const { open } = useEditEmployee()

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
              title: 'Tienda',
              dataIndex: ['sucursal', 'title'],
            },
            {
              title: 'Estado',
              dataIndex: 'status',
              render: (status) => (status == 1 ? 'Activo' : 'Inactivo'),
            },
            {
              title: '',
              render: (_, record) => {
                return (
                  <div className="">
                    {/* <button onClick={() => open(record)}>Editar</button> */}
                    <MdEdit
                      className="h-auto w-5 cursor-pointer"
                      onClick={() => open(record)}
                    />
                  </div>
                )
              },
            },
          ] satisfies ColumnsType<RhEmployee>
        }
      />
    </div>
  )
}
