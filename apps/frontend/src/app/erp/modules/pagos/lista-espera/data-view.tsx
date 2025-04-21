import { PATHS } from '@/const/paths'
import { Button, Table } from 'antd'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PaymentStatusBadge } from '../components/status-bage'
import { useRequirementsQuery } from './state'

export function DataView() {
  const { data } = useRequirementsQuery()
  const navigate = useNavigate()

  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={data}
        columns={[
          {
            title: 'Id',
            dataIndex: 'id',
          },
          {
            title: 'Proveedor',
            dataIndex: 'supplier_name',
          },
          {
            title: 'N° Doc',
            dataIndex: 'doc',
          },
          {
            title: 'Detalle',
            dataIndex: 'description',
          },
          {
            title: 'Contrato',
          },
          {
            title: 'Centro de costo',
            dataIndex: 'cost_center',
          },
          {
            title: 'Categoría',
            dataIndex: 'movetype',
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
          },
          {
            title: 'Vencimiento',
            dataIndex: 'expires_at',
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
                        PATHS.erp.modulos.pagos.revisar.replace(
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
