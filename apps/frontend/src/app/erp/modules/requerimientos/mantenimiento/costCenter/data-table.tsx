import { EditIcon } from '@/components/icons/icons_app'
import { CostCenterSelecet } from '@pizzadb'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { StoreTitleForm } from '../../components/stores-select'
import { useUpdateCostCenter } from './drawers/edit'

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
    title: 'Tienda',
    dataIndex: 'sucursal_id',
    sorter: (a: CostCenterSelecet, b: CostCenterSelecet) =>
      a.sucursal_id?.localeCompare(b.sucursal_id ?? '') ?? -1,
    render: (storeCode) => {
      return <StoreTitleForm storeId={storeCode} />
    },
  },
  {
    title: 'Tipo',
    dataIndex: 'type_cc',
    sorter: (a, b) => a.type_cc?.localeCompare(b.type_cc ?? '') ?? -1,
    render: (type: string) => (type === 'T' ? 'Tienda' : 'Otro'),
  },
] satisfies ColumnsType<CostCenterSelecet>

export function DataTable({ data }: { data: CostCenterSelecet[] }) {
  const { open } = useUpdateCostCenter()

  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        dataSource={data}
        columns={[
          ...columns,
          {
            title: 'Acciones',
            render: (_, record) => <EditIcon on_click={() => open(record)} />,
            //  <a onClick={() => open(record)}>Editar</a>,
          },
        ]}
        bordered
        pagination={false}
        size="small"
      />
    </div>
  )
}
