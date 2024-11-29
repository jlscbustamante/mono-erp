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
          sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
          title: 'Tienda',
          dataIndex: 'title',
          sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
          title: 'Dirección',
          dataIndex: 'ubi_address',
          sorter: (a, b) => {
            if (!a.ubi_address) return -1
            if (!b.ubi_address) return 1
            return a.ubi_address.localeCompare(b.ubi_address)
          },
        },
        {
          title: 'Distrito',
          dataIndex: 'ubi_district',
        },
        {
          title: 'Tipo de tienda',
          dataIndex: 'type_sede',
          render: (val: WAREHOUSE_TYPE) =>
            val == WAREHOUSE_TYPE.STORE ? 'Tienda' : 'Almacén',
          sorter: (a) => {
            if (a.type_sede === WAREHOUSE_TYPE.STORE) {
              return -1
            } else {
              return 1
            }
          },
        },
        {
          title: 'Concesionario',
          dataIndex: 'legalperson_name',
          sorter: (a, b) => {
            if (!a.legalperson_name) return -1
            if (!b.legalperson_name) return 1
            return a.legalperson_name.localeCompare(b.legalperson_name)
          },
        },
        {
          title: 'Ruc',
          dataIndex: 'sede_nro_ruc',
          sorter: (a, b) => {
            if (!a.sede_nro_ruc) return -1
            if (!b.sede_nro_ruc) return 1
            return a.sede_nro_ruc.localeCompare(b.sede_nro_ruc)
          },
          // sorter: (a, b) => a.sede_nro_ruc?.localeCompare(b.sede_nro_ruc),
        },
        {
          title: 'Serie factura',
          dataIndex: 'cfd_serie',
          sorter: (a, b) => {
            if (!a.cfd_serie) return -1
            if (!b.cfd_serie) return 1
            return a.cfd_serie.localeCompare(b.cfd_serie)
          },
        },
        {
          title: 'Serie guía',
          dataIndex: 'guide_serie',
          sorter: (a, b) => {
            if (!a.guide_serie) return -1
            if (!b.guide_serie) return 1
            return a.guide_serie.localeCompare(b.guide_serie)
          },
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
