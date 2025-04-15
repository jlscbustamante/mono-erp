import { Table } from 'antd'

export function DataView() {
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        columns={[
          {
            title: 'Id',
          },
          {
            title: 'Proveedor',
          },
          {
            title: 'N° Doc',
          },
          {
            title: 'Detalle',
          },
          {
            title: 'Contrato',
          },
          {
            title: 'Centro de costo',
          },
          {
            title: 'Categoría',
          },
          {
            title: 'Monto',
          },
          {
            title: 'Orden pago',
          },
          {
            title: 'Regis. por',
          },
          {
            title: 'Programación',
          },
          {
            title: 'Estado',
          },
        ]}
      />
    </div>
  )
}
