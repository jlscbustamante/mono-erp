import { WAREHOUSE_TYPE } from '@/data/hex/types'
import { Table } from 'antd'
import { Sucursal } from 'pizzadb'
import { RiPencilFill } from 'react-icons/ri'
import { useEditWarehouse } from './edit-drawer'
import { useFilterSucurales } from './state'

export const WarehouseTable = () => {
  // const { data: warehouses, isLoading } = useLegalWarehouses()
  const query = useFilterSucurales()
  const { open } = useEditWarehouse()
  return (
    <Table
      dataSource={query.data?.data}
      loading={query.isLoading}
      size="small"
      pagination={false}
      rowKey={(record) => record.id}
      columns={[
        {
          title: 'Codigo',
          dataIndex: 'id',
        },
        {
          title: 'Tienda',
          dataIndex: 'title',
          sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
          title: 'Dirección',
          dataIndex: 'ubi_address',
        },
        {
          title: 'Distrito',
          dataIndex: 'ubi_district',
        },
        {
          title: 'Tipo de tienda',
          dataIndex: 'type',
          render: (val: WAREHOUSE_TYPE) =>
            val == WAREHOUSE_TYPE.STORE ? 'Tienda' : 'Almacén',
        },
        {
          title: 'Concesionario',
          dataIndex: 'legalperson_name',
        },
        {
          title: 'Ruc',
          dataIndex: 'sede_nro_ruc',
        },
        {
          title: 'Serie factura',
          dataIndex: 'cfd_serie',
        },
        {
          title: 'Serie guía',
          dataIndex: 'guide_serie',
        },
        {
          title: '',
          render: (_, record: Sucursal) => (
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
