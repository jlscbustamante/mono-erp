import { Table } from 'antd'

export const DataTable = () => {
  return (
    <div>
      <Table
        columns={[
          {
            title: 'TIPO',
          },
          {
            title: 'NUMERO',
          },
          {
            title: 'FECHA EMISION',
          },
          {
            title: 'RAZON SOCIAL',
          },
          {
            title: 'SUB-TOTAL',
          },
          {
            title: '',
          },
          {
            title: 'POR PAGAR',
          },
        ]}
      />
    </div>
  )
}
