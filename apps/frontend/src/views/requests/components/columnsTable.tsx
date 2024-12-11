import { BiSolidFilePdf } from 'react-icons/bi'

import { IFilteredRequest, RequestTypeCategory } from '@/data/requests/types'
import { fCurrency } from '@/utils'
import { fDate } from '@/utils/formatDate'
import { openDocsUrls } from '@/utils/openDocsUrls'

export const columnsTable = {
  id: {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  requested_at: {
    title: 'Solicitado',
    dataIndex: 'requested_at',
    key: 'requested_at',
    render: (date: string) => {
      return <p>{fDate(date)}</p>
    },
  },
  request_type: {
    title: 'Tipo de solicitud',
    dataIndex: 'request_type',
    key: 'request_type',
  },
  legal_name: {
    title: 'Proveedor',
    dataIndex: 'legal_name',
    key: 'legal_name',
  },
  legal_number: {
    title: 'Número legal',
    dataIndex: 'legal_number',
    key: 'legal_number',
  },
  num_document: {
    title: 'N° Doc',
    dataIndex: 'num_document',
    key: 'num_document',
  },
  description: {
    title: 'Detalle',
    dataIndex: 'description',
    key: 'description',
  },
  category: {
    title: 'Categoria',
    dataIndex: ['category', 'name'],
    // dataIndex: 'category',
    render: (category: string | undefined, record: IFilteredRequest) => {
      return (
        <p>
          {record.category_move == RequestTypeCategory.Cash
            ? record.cashAccountCategory?.name
            : (category ?? '')}
        </p>
      )
    },
    key: 'category',
  },
  cash: {
    title: 'Caja',
    dataIndex: ['cashAccount', 'name'],
    render: (cashAccount: string | undefined) => {
      return <p>{cashAccount ?? ''}</p>
    },
    key: 'cashAccount',
  },
  cashOrigin: {
    title: 'Caja Origen',
    dataIndex: 'cashAccountCategory',
    render: (cashAccountCategory: { name: string }) => {
      return <p>{cashAccountCategory?.name}</p>
    },
    key: 'cashAccountCategory',
  },
  cashDst: {
    title: 'Caja Destino',
    dataIndex: 'cashAccount',
    render: (cashAccount: { name: string }) => {
      return <p>{cashAccount?.name}</p>
    },
    key: 'cashAccount',
  },
  requested_by: {
    title: 'Registrado por',
    dataIndex: 'created_by',
    key: 'requested_by',
  },
  approved_by: {
    title: 'Aprobado por',
    dataIndex: 'approved_by',
    key: 'approved_by',
  },
  rejected_by: {
    title: 'Rechazado por',
    dataIndex: 'rejected_by',
    key: 'rejected_by',
  },
  approved_at: {
    title: 'Aprobado',
    dataIndex: 'approved_at',
    key: 'approved_at',
    render: (date: string) => {
      return <p>{fDate(date)}</p>
    },
  },
  rejected_at: {
    title: 'Rechazado',
    dataIndex: 'rejected_at',
    key: 'rejected_at',
    render: (date: string) => {
      return <p>{fDate(date)}</p>
    },
  },
  amount: {
    title: 'Monto',
    dataIndex: 'amount',
    key: 'amount',
    __cellType__: 'TypeNumeric',
    render: (amount: number) => {
      return <p className="text-right">{fCurrency(amount, false)}</p>
    },
    excelRender: (amount: number) => {
      return amount
    },
  },
  amountNet: {
    title: 'Monot neto',
    dataIndex: 'amount_net',
    key: 'amount_net',
    __cellType__: 'TypeNumeric',
    excelRender: (amount: number) => {
      return amount
    },
  },
  amountRet: {
    title: 'Retencion',
    dataIndex: 'amount_ret',
    key: 'amount_ret',
    __cellType__: 'TypeNumeric',
    excelRender: (amount: number) => {
      return amount
    },
  },
  costCenter: {
    title: 'Centro de costo',
    dataIndex: ['costCenter', 'origin'],
    key: 'cost_center',
  },
  icon: {
    title: () => <BiSolidFilePdf className="w-6 h-auto" />,
    dataIndex: 'doc_url',
    key: 'icon',
    render: (doc_url: string | null) => {
      if (!doc_url)
        return (
          <BiSolidFilePdf className="w-6 h-auto text-gray-200 cursor-not-allowed" />
        )
      return (
        <BiSolidFilePdf
          className="w-6 h-auto cursor-pointer"
          onClickCapture={(e: any) => {
            e.stopPropagation()
            openDocsUrls(doc_url)
          }}
        />
      )
    },
  },
}

export const columnsApproved = {
  supplier: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.description,
    columnsTable.cash,
    columnsTable.costCenter,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
  transfer: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.cashOrigin,
    columnsTable.cashDst,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
  reportCostCenter: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.category,
    columnsTable.cash,
    columnsTable.costCenter,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
  default: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.category,
    columnsTable.cash,
    columnsTable.costCenter,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
}

export const columnsRequested = {
  supplier: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.description,
    columnsTable.category,
    columnsTable.costCenter,
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.icon,
  ],
  transfer: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.cashOrigin,
    columnsTable.cashDst,
    columnsTable.requested_by,
    columnsTable.amount,
  ],
  default: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.num_document,
    columnsTable.description,
    columnsTable.category,
    columnsTable.costCenter,
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.icon,
  ],
}

export const columnsRejected = {
  supplier: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.description,
    columnsTable.cash,
    columnsTable.rejected_by,
    columnsTable.rejected_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
  transfer: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.cashOrigin,
    columnsTable.cashDst,
    columnsTable.rejected_by,
    columnsTable.rejected_at,
    columnsTable.amount,
  ],
  default: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.description,
    columnsTable.category,
    columnsTable.cash,
    columnsTable.rejected_by,
    columnsTable.rejected_at,
    columnsTable.amount,
    columnsTable.icon,
  ],
}
