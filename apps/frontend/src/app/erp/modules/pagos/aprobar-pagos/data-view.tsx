import { PATHS } from '@/const/paths'
import { Button, Table } from 'antd'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router'
import { PaymentOrderStatusBadge } from '../components/order_status_badge'
import { useAprobarPagosQuery } from './state'

export function DataView() {
  const { data } = useAprobarPagosQuery()
  const navigate = useNavigate()
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
            title: 'Fecha emision',
            dataIndex: 'payment_at',
            render: (val) => {
              return format(new Date(val), 'yyyy-MM-dd HH:mm')
            },
          },
          {
            title: 'Tipo de operación',
            dataIndex: 'bankaccount_type',
          },
          {
            title: 'Importe',
            dataIndex: 'amount',
          },
          {
            title: 'Moneda',
            dataIndex: 'money',
          },
          {
            title: 'Empresa',
            dataIndex: 'company_id',
          },
          {
            title: 'Cuenta',
            dataIndex: 'bankaccount_number',
          },
          {
            title: 'Autoriza1',
          },
          {
            title: 'Autoriza2',
          },
          {
            title: 'Programado por',
            dataIndex: 'required_by',
          },
          {
            title: 'Estado',
            dataIndex: 'status',
            render: (val) => <PaymentOrderStatusBadge status={val} />,
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
                        PATHS.erp.modulos.pagos.aprobarPagos.revisarOrden.replace(
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
