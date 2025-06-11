import { PATHS } from '@/const/paths'
import { Table } from 'antd'
import { format } from 'date-fns'
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
        rowKey={'id'}
        columns={[
          {
            title: 'Id',
            dataIndex: 'payment_code',
            render: (val, record) => {
              return (
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(
                      PATHS.erp.modulos.pagos.aprobarPagos.revisarOrden.replace(
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
            title: 'Autorización 1',
            dataIndex: 'approved1_by',
          },
          {
            title: 'Autorización 2',
            dataIndex: 'approved2_by',
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
        ]}
      />
    </div>
  )
}
