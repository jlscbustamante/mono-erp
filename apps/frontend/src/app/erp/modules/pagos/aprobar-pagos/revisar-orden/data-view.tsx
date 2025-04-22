import { AdmRequirementSelect } from '@types'
import { Table } from 'antd'

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
          },
          {
            title: 'Correo proveedor',
          },
        ]}
      />
    </div>
  )
}
