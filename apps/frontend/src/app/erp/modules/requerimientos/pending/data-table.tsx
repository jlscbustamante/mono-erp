import { PATHS } from '@/const/paths'
import { fNumber } from '@/utils/formatNumber'
import { IRequirementPresentation } from '@view'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router-dom'

export function DataTable({ data }: { data: IRequirementPresentation[] }) {
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
              dataIndex: 'requestedAt',
            },
            {
              title: 'Proveedor',
              dataIndex: 'supplier',
            },
            {
              title: 'N° Doc',
              dataIndex: 'numDoc',
            },
            {
              title: 'Detalle',
              dataIndex: 'description',
            },
            {
              title: 'Centro de costo',
              dataIndex: 'costCenter',
            },
            {
              title: 'Creado por',
              dataIndex: 'createdBy',
            },
            {
              title: 'F. Pago',
              dataIndex: 'paymentMethod',
            },
            {
              title: 'Cuotas',
              dataIndex: 'numQuota',
            },
            {
              title: 'Monto',
              dataIndex: 'amount',
              className: 'text-right',
              render: (amount: number) => fNumber(amount),
            },
            // {
            //   title: 'Doc',
            //   render: () => {
            //     return <FileText className="text-slate-500" size={18} />
            //   },
            // },
            {
              title: 'Acciones',
              render: (_, record) => {
                return (
                  <Link
                    to={
                      PATHS.erp.modulos.requerimientos.review +
                      `?id=${record.id}`
                    }
                  >
                    Revisar
                  </Link>
                )
              },
            },
          ] satisfies ColumnsType<IRequirementPresentation>
        }
      />
    </div>
  )
}
