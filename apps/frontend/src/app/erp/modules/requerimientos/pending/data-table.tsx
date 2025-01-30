import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import type { Requirement } from '@view'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DataTable() {
  const { data = [] } = useQuery({
    queryKey: ['requirements'],
    queryFn: async () => {
      const request = await viewClient.api.view.requirement.filter.$get({
        query: {
          filters: JSON.stringify([]),
        },
      })
      const data = await request.json()

      return data.data as Requirement[]
    },
  })

  return (
    <div>
      <Table
        dataSource={data}
        size="small"
        bordered
        rowKey={(record) => record.id}
        pagination={false}
        columns={
          [
            {
              title: 'Id',
              dataIndex: 'id',
            },
            {
              title: 'Solicitado',
              dataIndex: 'requested_at',
            },
            {
              title: 'Proveedor',
              dataIndex: 'supplier',
            },
            {
              title: 'N° Doc',
              dataIndex: 'num_doc',
            },
            {
              title: 'Detalle',
              dataIndex: 'detail',
            },
            {
              title: 'Cuota',
              render: () => {
                return '2/3'
              },
            },
            {
              title: 'Registrado por',
              dataIndex: 'costCenter',
            },
            {
              title: 'Monto',
              dataIndex: 'amount',
            },
            {
              title: 'Doc',
              render: () => {
                return <FileText className="text-slate-600" size={18} />
              },
            },
            {
              title: 'Acciones',
              render: () => {
                return (
                  <Link to={PATHS.erp.modulos.requerimientos.review}>
                    Revisar
                  </Link>
                )
              },
            },
          ] satisfies ColumnsType<Requirement>
        }
      />
    </div>
  )
}
