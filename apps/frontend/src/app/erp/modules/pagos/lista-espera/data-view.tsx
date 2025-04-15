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
            title: 'Regis. por',
          },
          {
            title: 'Solicitado',
          },
          {
            title: 'Vencimiento',
          },
          {
            title: 'Estado',
          },
        ]}
      />
    </div>
  )
}
