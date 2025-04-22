import { Table } from 'antd'
import { format } from 'date-fns'
import { PaymentStatusBadge } from '../components/status-bage'
import { useAnticipoQuery } from './state'

export function DataView() {
  const { data } = useAnticipoQuery()
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={data}
        columns={[
          {
            title: 'Nro',
            dataIndex: 'id',
          },
          {
            title: 'Caja origen',
            dataIndex: 'cashbank_source_name',
          },
          {
            title: 'Caja destino',
            dataIndex: 'cashbank_target_name',
          },
          {
            title: 'Detalle',
            dataIndex: 'description',
          },
          {
            title: 'Monto',
            dataIndex: 'amount',
          },
          {
            title: 'Regis. por',
            dataIndex: 'created_by',
          },
          {
            title: 'Solicitado',
            dataIndex: 'requested_at',
            render: (val) => format(new Date(val), 'yyyy-MM-dd'),
          },
          {
            title: 'Estado',
            dataIndex: 'status',
            render: (val) => <PaymentStatusBadge status={val} />,
          },
        ]}
      />
    </div>
  )
}
