import { Table } from 'antd'

export function DataView() {
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        dataSource={[
          {
            nro: '13213',
          },
        ]}
        columns={[
          {
            title: 'Nro',
            dataIndex: 'nro',
          },
          {
            title: 'Fecha emision',
          },
          {
            title: 'Tipo de operación',
          },
          {
            title: 'Importe',
          },
          {
            title: 'Moneda',
          },
          {
            title: 'Empresa',
          },
          {
            title: 'Cuenta',
          },
          {
            title: 'Autoriza1',
          },
          {
            title: 'Autoriza2',
          },
          {
            title: 'Programado por',
          },
          {
            title: 'Estado',
          },
        ]}
      />
    </div>
  )
}
