import { PATHS } from '@/const/paths'
import { Button, Table } from 'antd'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
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
          {
            render: (_, record) => {
              return (
                <div className="flex items-center justify-center">
                  <Button
                    variant="filled"
                    type="text"
                    size="small"
                    onClick={() => {
                      navigate(
                        PATHS.erp.modulos.pagos.revisarNonDoc.replace(
                          ':id',
                          record.id.toString(),
                        ),
                      )
                    }}
                  >
                    <Eye />
                  </Button>
                </div>
              )
            },
          },
        ]}
      />
    </div>
  )
}
