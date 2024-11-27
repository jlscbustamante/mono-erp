import { WAREHOUSE_TYPE, WarehouseLegal } from '@/data/hex/types'
import { useLegalWarehouses } from '@/hooks/data/iventory/use-legal-warehouses'
import { Table } from 'antd'
import { RiPencilFill } from 'react-icons/ri'
import { useEditWarehouse } from './edit-drawer'

export const WarehouseTable = () => {
  const { data: warehouses, isLoading } = useLegalWarehouses()
  const { open } = useEditWarehouse()
  return (
    <Table
      dataSource={warehouses}
      loading={isLoading}
      size="small"
      pagination={false}
      rowKey={(record) => record.code}
      columns={[
        {
          title: 'Codigo',
          dataIndex: 'code',
        },
        {
          title: 'Tienda',
          dataIndex: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: 'Dirección',
          dataIndex: 'legalAddress',
        },
        {
          title: 'Distrito',
          dataIndex: 'district',
        },
        {
          title: 'Tipo de tienda',
          dataIndex: 'type',
          render: (val: WAREHOUSE_TYPE) =>
            val == WAREHOUSE_TYPE.STORE ? 'Tienda' : 'Almacén',
        },
        {
          title: 'Concesionario',
          dataIndex: 'legalName',
        },
        {
          title: 'Ruc',
          dataIndex: 'legalNumber',
        },
        {
          title: 'Serie factura',
          dataIndex: 'serie',
        },
        {
          title: 'Serie guía',
          dataIndex: 'guideSerie',
        },
        {
          title: '',
          render: (_, record: WarehouseLegal) => (
            <RiPencilFill
              className="text-slate-700 w-5 h-auto cursor-pointer"
              onClick={() => open(record)}
            />
          ),
        },
      ]}
    />
  )
}
