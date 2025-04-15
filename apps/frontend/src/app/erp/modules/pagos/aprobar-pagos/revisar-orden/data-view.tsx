import { Table } from 'antd'

export const DataView = () => {
  return (
    <div>
      <Table
        pagination={false}
        size="small"
        bordered={true}
        columns={[
          {
            title: 'Nro',
          },
          {
            title: 'RUC DEL PROVEEDOR (11 digitos)',
          },
          {
            title: 'RÁZON SOCIAL (se consideran lkos primeros 60 caracteres)',
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
          },
          {
            title: 'IMPORTE',
          },
          {
            title: 'TIPO DE DOCUMENTO DE PAGO',
          },
          {
            title: 'N° DOCUMENTO (max 20 caracteres)',
          },
          {
            title: 'FECHA EMISION DOCUMENTO',
          },
          {
            title: 'CORREO ELECTRONICO',
          },
        ]}
      />
    </div>
  )
}
