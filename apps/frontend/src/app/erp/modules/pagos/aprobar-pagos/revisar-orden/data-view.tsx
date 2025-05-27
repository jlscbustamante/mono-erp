import { AdmRequirementSelect } from '@types'
import { Table } from 'antd'
import { format } from 'date-fns'

export const DataView = ({
  requirements,
}: {
  requirements: AdmRequirementSelect[]
}) => {
  return (
    <div>
      <Table
        pagination={false}
        size="small"
        rowKey={'id'}
        bordered={true}
        dataSource={requirements}
        columns={[
          {
            title: 'N°',
            dataIndex: 'id',
          },
          {
            title: 'Ruc',
            dataIndex: 'legal_number',
          },
          {
            title: 'Razón social',
            dataIndex: 'legal_name',
          },
          {
            title: 'Tipo cuenta',
          },
          {
            title: 'Banco',
          },
          {
            title: 'Nro cuenta',
          },
          {
            title: 'Detalle de pago',
            dataIndex: 'description',
          },
          {
            title: 'Importe',
            dataIndex: 'amount',
          },
          {
            title: 'Tipo doc',
            dataIndex: 'type_document',
          },
          {
            title: 'Nro doc',
            dataIndex: 'num_document',
          },
          {
            title: 'Fecha emisión',
            dataIndex: 'requested_at',
            render: (val) => {
              return format(new Date(val), 'yyyy-MM-dd')
            },
          },
          {
            title: 'Correo proveedor',
          },
        ]}
      />
    </div>
  )
}
