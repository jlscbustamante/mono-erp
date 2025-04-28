import { PATHS } from '@/const/paths'
import { PAYMENT_STATUS, RequirementViewDto } from '@types'
import { Button, Table } from 'antd'
import { Eye } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'
import { PaymentStatusBadge } from '../components/status-bage'
import { useProgramarPagosQuery } from './state'

export function DataView({
  selected_row_keys,
  set_selected_row_keys,
}: {
  selected_row_keys: React.Key[]
  set_selected_row_keys: (selected_row_key: React.Key[]) => void
}) {
  const { data } = useProgramarPagosQuery()
  const navigate = useNavigate()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    set_selected_row_keys(newSelectedRowKeys)
  }

  return (
    <div>
      <Table
        rowSelection={{
          type: 'checkbox',
          getCheckboxProps: (record: RequirementViewDto) => ({
            disabled: record.status != PAYMENT_STATUS.APPROVED, // Column configuration not to be checked
            name: record.id.toString(),
          }),
          selectedRowKeys: selected_row_keys,
          onChange: onSelectChange,
        }}
        size="small"
        pagination={false}
        dataSource={data}
        rowKey={'id'}
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
