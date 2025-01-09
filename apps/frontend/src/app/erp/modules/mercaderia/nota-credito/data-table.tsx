import { Table } from 'antd'
import dayjs from 'dayjs'
import { useNotaCreditoStore } from './state'

export const DataTable = () => {
  const data = useNotaCreditoStore((st) => st.data)
  return (
    <div className="my-3">
      <Table
        pagination={false}
        size="small"
        dataSource={data}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
          },
          {
            title: 'Factura',
            dataIndex: 'doc_operacion',
            sorter: (a, b) => a.doc_operacion.localeCompare(b.doc_operacion),
          },
          {
            title: 'Fecha',
            dataIndex: 'doc_emision_at',
            render: (date: string) => {
              return dayjs(date).format('YYYY-MM-DD')
            },
          },
        ]}
      />
    </div>
  )
}
