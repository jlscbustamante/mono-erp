import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { format, parseISO } from 'date-fns'
import { Attendance } from 'pizzadb'
import { useAsistenciaContext } from '.'

export const AttendanceTable = () => {
  const { data } = useAsistenciaContext()
  // return <div>{JSON.stringify(data)}</div>
  return (
    <Table
      dataSource={data}
      rowKey={(record) => record.id}
      size="small"
      pagination={false}
      bordered
      columns={
        [
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Empleado',
            render: (_, record: Attendance) => {
              return `${record.employee.first_name} ${record.employee.last_name}`
            },
          },
          {
            title: 'Evento',
            dataIndex: 'event',
          },
          {
            title: 'Fecha',
            dataIndex: 'attendance_at',
            render: (text: string) =>
              format(parseISO(text), 'yyyy-MM-dd HH:mm:ss'),
          },
        ] satisfies ColumnsType<Attendance>
      }
    />
  )
}
