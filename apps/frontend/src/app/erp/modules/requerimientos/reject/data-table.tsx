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
              sorter: (a, b) => a.id - b.id,
            },
            {
              title: 'Proveedor',
              dataIndex: 'supplier',
              sorter: (a, b) => a.supplier?.localeCompare(b.supplier ?? ''),
            },
            {
              title: 'Solicitado',
              dataIndex: 'requestedAt',
              sorter: (a, b) => +(a.requestedAt > b.requestedAt),
            },
            {
              title: 'N° Doc',
              dataIndex: 'numDoc',
              sorter: (a, b) => +(a.requestedAt > b.requestedAt),
            },
            {
              title: 'Detalle',
              dataIndex: 'description',
              sorter: (a, b) =>
                a.description?.localeCompare(b.description ?? ''),
            },
            {
              title: 'Centro de costo',
              dataIndex: 'costCenter',
              sorter: (a, b) => a.costCenter?.localeCompare(b.costCenter ?? ''),
            },
            {
              title: 'Categoria',
              dataIndex: 'category',
              sorter: (a, b) => a.category?.localeCompare(b.category ?? ''),
            },
            {
              title: 'Rechazado por',
              dataIndex: 'rejectedBy',
            },
            {
              title: 'F. Pago',
              dataIndex: 'paymentMethod',
            },
            {
              title: 'N° Q',
              dataIndex: 'numQuota',
              sorter: (a, b) => a.numQuota - b.numQuota,
            },
            {
              title: 'Monto',
              dataIndex: 'amount',
              className: 'text-right',
              render: (amount: number) => fNumber(amount),
              sorter: (a, b) => a.amount - b.amount,
            },
            {
              title: 'Acciones',
              render: (_, record) => {
                return (
                  <Link
                    to={
                      PATHS.erp.modulos.requerimientos.review +
                      `?id=${record.id}&bf=${PATHS.erp.modulos.requerimientos.aprobados}`
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
