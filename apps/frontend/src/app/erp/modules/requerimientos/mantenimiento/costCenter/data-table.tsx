import { viewClient } from '@/lib/rpc'
import { CostCenterSelecet } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useCostCenter } from './state'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    sorter: (a: CostCenterSelecet, b: CostCenterSelecet) => a.id - b.id,
  },
  {
    title: 'Nombre',
    dataIndex: 'costcenter',
    sorter: (a: CostCenterSelecet, b: CostCenterSelecet) =>
      a.costcenter.localeCompare(b.costcenter),
  },
  {
    title: 'Compañia',
    dataIndex: 'company_id',
    sorter: (a: CostCenterSelecet, b: CostCenterSelecet) =>
      a.company_id?.localeCompare(b.company_id ?? '') ?? -1,
  },
  {
    title: 'Tipo',
    dataIndex: 'type_cc',
    sorter: (a, b) => a.type_cc?.localeCompare(b.type_cc ?? '') ?? -1,
  },
] satisfies ColumnsType<CostCenterSelecet>

export function DataTable() {
  const filters = useCostCenter((st) => st.filters)

  const query = useQuery({
    queryKey: ['req:cost-center'],
    queryFn: async () => {
      const data = await viewClient.api.view.costcenter.filter.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const body = await data.json()
      return body.data as CostCenterSelecet[]
    },
  })

  return (
    <div>
      <Table
        dataSource={query.data}
        columns={columns}
        bordered
        pagination={false}
        size="small"
      />
    </div>
  )
}
