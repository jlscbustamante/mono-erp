import { PATHS } from '@/const/paths'
import { Table } from 'antd'
import { useNavigate } from 'react-router'
import { PaymentStatusBadge } from '../components/status-bage'
import { useProgramarPagosQuery } from './state'

export function DataView() {
  const { data } = useProgramarPagosQuery()
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
            dataIndex: 'code',
            render: (val, record) => {
              return (
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => {
                    navigate(
                      PATHS.erp.modulos.pagos.revisar.replace(
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
        ]}
      />
    </div>
  )
}
