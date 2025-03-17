import { Table } from 'antd'
import { ItemReport } from './state'

export const DataTable = ({ data }: { data: Partial<ItemReport>[] }) => {
  return (
    <div className="container">
      <Table
        dataSource={data}
        bordered
        columns={[
          {
            title: 'TIPO',
            dataIndex: 'requestType',
            width: 90,
          },
          {
            title: 'NUMERO',
            dataIndex: 'docNumber',
            width: 200,
          },
          {
            title: 'FECHA EMISION',
            dataIndex: 'requestedAt',
            render: (val: string) => val?.split(' ')?.[0],
            width: 140,
          },
          {
            title: 'RAZON SOCIAL',
            dataIndex: 'legalName',
            render: (val, record) => {
              if (!val && !record.isSummary) {
                return <span className="italic text-sm">(sin documento)</span>
              }
              return <span>{val}</span>
            },
          },
          {
            title: 'SUB-TOTAL',
            dataIndex: 'subTitle',
          },
          {
            title: 'POR PAGAR',
            dataIndex: 'amount',
            align: 'right',
          },
        ]}
        onRow={(record) => {
          if (record.isSummary) {
            return {
              style: {
                fontWeight: 'bold',
              },
            }
          }
          if (!record.docNumber) return {}
          return {
            style: {
              backgroundColor: 'rgb(248, 248, 248)',
              fontWeight: 'bold',
            },
          }
        }}
        size="small"
        pagination={false}
      />
    </div>
  )
}
