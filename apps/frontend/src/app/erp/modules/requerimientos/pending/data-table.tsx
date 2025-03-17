import { PATHS } from '@/const/paths'
import { fNumber } from '@/utils/formatNumber'
import { IRequirementPresentation, REQUIERMENT_TYPE } from '@view'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export function DataTable({
  data,
  type,
}: {
  data: IRequirementPresentation[]
  type?: REQUIERMENT_TYPE
}) {
  const isTransfer = useMemo(() => type == REQUIERMENT_TYPE.TRANSFER, [type])

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
              showSorterTooltip: false,
            },
            {
              title: 'Proveedor',
              dataIndex: 'supplier',
              sorter: (a, b) => a.supplier?.localeCompare(b.supplier ?? ''),
              showSorterTooltip: false,
              hidden: isTransfer,
            },
            {
              title: 'Solicitado',
              dataIndex: 'requestedAt',
              sorter: (a, b) => +(a.requestedAt > b.requestedAt),
              showSorterTooltip: false,
            },
            {
              title: 'N° Doc',
              dataIndex: 'numDoc',
              sorter: (a, b) => a.numDoc?.localeCompare(b.numDoc ?? ''),
              showSorterTooltip: false,
              hidden: isTransfer,
            },
            {
              title: 'Detalle',
              dataIndex: 'description',
              sorter: (a, b) =>
                a.description?.localeCompare(b.description ?? ''),
              showSorterTooltip: false,
            },
            {
              title: 'Centro de costo',
              dataIndex: 'costCenter',
              sorter: (a, b) => a.costCenter?.localeCompare(b.costCenter ?? ''),
              showSorterTooltip: false,
              hidden: isTransfer,
            },
            {
              title: 'Categoria',
              dataIndex: 'category',
              sorter: (a, b) => a.category?.localeCompare(b.category ?? ''),
              showSorterTooltip: false,
              hidden: isTransfer,
            },
            {
              title: 'Caja Origen',
              dataIndex: 'originName',
              showSorterTooltip: false,
              hidden: !isTransfer,
            },
            {
              title: 'Caja destino',
              dataIndex: 'destinyName',
              showSorterTooltip: false,
              hidden: !isTransfer,
            },
            {
              title: 'Regis. por',
              dataIndex: 'createdBy',
              sorter: (a, b) => a.createdBy?.localeCompare(b.createdBy ?? ''),
              showSorterTooltip: false,
            },
            {
              title: 'F. Pago',
              dataIndex: 'paymentMethod',
              sorter: (a, b) =>
                a.paymentMethod?.localeCompare(b.paymentMethod ?? ''),
              showSorterTooltip: false,
            },
            {
              title: 'N° Q',
              dataIndex: 'numQuota',
              sorter: (a, b) => a.numQuota - b.numQuota,
              showSorterTooltip: false,
              hidden: isTransfer,
            },
            // 17:43-> 17:50
            // {
            //   title: 'Vencimiento',
            //   dataIndex: 'expiresAt',
            //   // sorter: (a, b) => +(a.expiresAt > b.expiresAt),
            //   sorter: (a, b) => {
            //     if (!a.expiresAt) return -1
            //     if (!b.expiresAt) return 1
            //     return +(a.expiresAt > b.expiresAt)
            //   },
            // },
            {
              title: 'Monto',
              dataIndex: 'amount',
              className: 'text-right',
              render: (amount: number) => fNumber(amount),
              sorter: (a, b) => a.amount - b.amount,
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
