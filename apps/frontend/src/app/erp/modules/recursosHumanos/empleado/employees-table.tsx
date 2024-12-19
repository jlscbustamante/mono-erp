import { useSession } from '@/app/erp/use-session'
import { cn } from '@/utils'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { RhEmployee } from 'pizzadb'
import { useMemo } from 'react'
import { MdEdit } from 'react-icons/md'
import { useEmpleadoContext } from '.'
import { useEditEmployee } from './edit-employee-drawer'

export const EmployeesTable = ({
  motorizadPage,
}: {
  motorizadPage: boolean
}) => {
  // const query = useFilterEmployees()
  const { data, isLoading } = useEmpleadoContext()
  const { open } = useEditEmployee()
  const session = useSession((st) => st.user)

  const employees = useMemo(() => {
    const motorizedId = session.parameters['JOBS_ID']['DELIVERY']
    if (!motorizedId) return data

    const employeesFiltered = data.filter((el) => {
      if (motorizadPage) {
        return el.jobtitle_id == +motorizedId
      } else {
        return el.jobtitle_id != +motorizedId
      }
    })
    return employeesFiltered
  }, [data])

  return (
    <div className="">
      <Table
        rowKey={(record) => record.id}
        bordered
        pagination={false}
        size="small"
        loading={isLoading}
        dataSource={employees}
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
              title: 'Cargo',
              dataIndex: ['jobtitle', 'name'],
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
                    <MdEdit
                      className={cn('h-auto w-5 cursor-pointer')}
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
