import { PATHS } from '@/const/paths'
import { Table } from 'antd'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'
import { PaymentStatusBadge } from '../components/status-bage'
import { useTransferenciasQuery } from './state'

export function DataView() {
  const { data } = useTransferenciasQuery()
  const navigate = useNavigate()
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={data}
        rowKey={'id'}
        columns={[
          {
            title: 'Nro',
            dataIndex: 'request_code',
            render: (val, record) => {
              return (
                <span
                  className="text-blue-600 hover:cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(
                      PATHS.erp.modulos.pagos.revisarNonDoc.replace(
                        ':id',
                        record.id.toString(),
                      ),
                    )
                  }}
                >
                  {val}
                </span>
              )
            },
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
