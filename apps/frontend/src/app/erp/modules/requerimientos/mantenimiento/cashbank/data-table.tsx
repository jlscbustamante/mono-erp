import { EditIcon } from '@/components/icons/icons_app'
import { CashBankSelect } from '@pizzadb'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { StoreTitleForm } from '../../components/stores-select'
import { useUpdateCashBank } from './drawers/edit'

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    sorter: (a: CashBankSelect, b: CashBankSelect) => a.id - b.id,
  },
  {
    title: 'Nombre',
    dataIndex: 'cashbank',
    sorter: (a: CashBankSelect, b: CashBankSelect) =>
      a.cashbank.localeCompare(b.cashbank),
  },
  {
    title: 'Cuenta',
    dataIndex: 'account_id',
  },
  {
    title: 'Compañia',
    dataIndex: 'company_id',
    sorter: (a: CashBankSelect, b: CashBankSelect) =>
      a.company_id?.localeCompare(b.company_id ?? '') ?? -1,
  },
  {
    title: 'Tienda',
    dataIndex: 'sucursal_id',
    sorter: (a: CashBankSelect, b: CashBankSelect) =>
      a.sucursal_id?.localeCompare(b.sucursal_id ?? '') ?? -1,
    render: (storeCode) => {
      return <StoreTitleForm storeId={storeCode} />
    },
  },
  {
    title: 'Tipo',
    dataIndex: 'type_cash',
    render: (type) => {
      return type == 1
        ? 'Tiendas'
        : type == 3
          ? 'Bancos'
          : type == 4
            ? 'Central'
            : type == 5
              ? 'Corales'
              : type == 6
                ? 'Liquidadora'
                : ''
    },
  },
] satisfies ColumnsType<CashBankSelect>

export function DataTable({ data }: { data: CashBankSelect[] }) {
  const { open } = useUpdateCashBank()

  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        dataSource={data}
        columns={[
          ...columns,
          {
            title: 'Acciones',
            render: (_, record) => (
              <EditIcon
                on_click={() => {
                  open(record)
                }}
              />
            ),
          },
        ]}
        bordered
        pagination={false}
        size="small"
      />
    </div>
  )
}
