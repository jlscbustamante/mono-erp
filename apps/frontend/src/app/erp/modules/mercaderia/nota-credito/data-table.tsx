import { Table } from 'antd'

export const DataTable = () => {
  return (
    <div className="my-3">
      <Table
        size="small"
        columns={[
          {
            title: 'Factura',
          },
          {
            title: 'Tipo',
          },
          {
            title: 'Fecha',
          },
        ]}
      />
    </div>
  )
}
