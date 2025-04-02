import { MoveCashSelect } from '@pizzadb'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useUpdateCategory } from './drawers/edit'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    sorter: (a: MoveCashSelect, b: MoveCashSelect) => a.id - b.id,
  },
  {
    title: 'Nombre',
    dataIndex: 'movecash',
    sorter: (a: MoveCashSelect, b: MoveCashSelect) =>
      a.movecash.localeCompare(b.movecash),
  },
  {
    title: 'Cuenta',
    dataIndex: 'account_id',
    sorter: (a: MoveCashSelect, b: MoveCashSelect) =>
      a.movecash?.localeCompare(b.movecash ?? '') ?? -1,
  },
  {
    title: 'Usado para',
    dataIndex: 'used_to',
    sorter: (a: MoveCashSelect, b: MoveCashSelect) =>
      a.movecash?.localeCompare(b.movecash ?? '') ?? -1,
    render: (used_to) => {
      if (used_to == '1') return 'Para las tiendas'
      if (used_to == '4') return 'Para requerimientos'
      if (used_to == '7') return 'Para multiple'
      return ''
    },
  },
  {
    title: 'Tipo',
    dataIndex: 'origin_from',
    render: (origin_from: string) => {
      if (origin_from === 'G') return 'Gasto'
      if (origin_from === 'V') return 'Venta'
      return ''
    },
  },
  {
    title: 'Flujo caja',
    dataIndex: 'cash_flow',
    render: (cash_flow) => {
      if (cash_flow === 'I') return 'Ingreso'
      if (cash_flow === 'S') return 'Salida'
      return ''
    },
  },
  {
    title: 'Flujo de cuenta',
    dataIndex: 'account_flow',
    render: (account_flow) => {
      if (account_flow === 'I') return 'Ingreso'
      if (account_flow === 'S') return 'Salida'
      return ''
    },
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    render: (status: string) => {
      if (status == '1') return 'Activo'
      if (status == '0') return 'Inactivo'
      return ''
    },
  },
  // {
  //   title: 'Tipo',
  //   dataIndex: 'type_cc',
  //   sorter: (a, b) => a.type_cc?.localeCompare(b.type_cc ?? '') ?? -1,
  //   render: (type: string) => (type === 'T' ? 'Tienda' : 'Otro'),
  // },
] satisfies ColumnsType<MoveCashSelect>

export function DataTable({ data }: { data: MoveCashSelect[] }) {
  const { open } = useUpdateCategory()

  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        dataSource={data}
        columns={[
          ...columns,
          {
            title: 'Acciones',
            render: (_, record) => <a onClick={() => open(record)}>Editar</a>,
          },
        ]}
        bordered
        pagination={false}
        size="small"
      />
    </div>
  )
}
