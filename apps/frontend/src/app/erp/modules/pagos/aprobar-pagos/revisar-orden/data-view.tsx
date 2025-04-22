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
            title: 'Nro',
            dataIndex: 'id',
          },
          {
            title: 'RUC DEL PROVEEDOR (11 digitos)',
            dataIndex: 'legal_number',
          },
          {
            title: 'RÁZON SOCIAL (se consideran lkos primeros 60 caracteres)',
            dataIndex: 'legal_name',
          },
          {
            title: 'TIPO DE CUENTA',
          },
          {
            title: 'CUENTA SCOTIABANK (10 digitos)',
          },
          {
            title: 'CUENTA INTERBANCARIA(CCI)',
          },
          {
            title: 'DETALLE PAGO',
            dataIndex: 'description',
          },
          {
            title: 'IMPORTE',
            dataIndex: 'amount',
          },
          {
            title: 'TIPO DE DOCUMENTO DE PAGO',
            dataIndex: 'type_document',
          },
          {
            title: 'N° DOCUMENTO (max 20 caracteres)',
            dataIndex: 'num_document',
          },
          {
            title: 'FECHA EMISION DOCUMENTO',
            dataIndex: 'requested_at',
          },
          {
            title: 'CORREO ELECTRONICO',
          },
        ]}
      />
    </div>
  )
}
