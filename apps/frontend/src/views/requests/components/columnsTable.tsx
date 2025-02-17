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
    sorter: (a: any, b: any) => a.id - b.id,
  },
  requested_at: {
    title: 'Solicitado',
    dataIndex: 'requested_at',
    key: 'requested_at',
    sorter: () => -1,
    render: (date: string) => {
      return <p className="min-w-max">{fDate(date)}</p>
    },
  },
  request_type: {
    title: 'Tipo de solicitud',
    dataIndex: 'request_type',
    key: 'request_type',
    sorter: () => -1,
  },
  legal_name: {
    title: 'Proveedor',
    dataIndex: 'legal_name',
    key: 'legal_name',
    render: (text: string) => {
      return <p className="max-w-80">{text}</p>
    },
    excelRender: (text: string) => text,
    sorter: () => -1,
  },
  legal_number: {
    title: 'Número legal',
    dataIndex: 'legal_number',
    key: 'legal_number',
    sorter: () => -1,
  },
  num_document: {
    title: 'N° Doc',
    dataIndex: 'num_document',
    key: 'num_document',
    sorter: () => -1,
  },
  description: {
    title: 'Detalle',
    dataIndex: 'description',
    key: 'description',
    sorter: () => -1,
  },
  category: {
    title: 'Categoria',
    dataIndex: ['category', 'name'],
    // dataIndex: 'category',
    sorter: () => -1,
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
    sorter: () => -1,
    render: (cashAccount: string | undefined) => {
      return <p>{cashAccount ?? ''}</p>
    },
    key: 'cashAccount',
  },
  cashOrigin: {
    title: 'Caja Origen',
    dataIndex: 'cashAccountCategory',
    sorter: () => -1,
    render: (cashAccountCategory: { name: string }) => {
      return <p>{cashAccountCategory?.name}</p>
    },
    key: 'cashAccountCategory',
  },
  cashDst: {
    title: 'Caja Destino',
    dataIndex: 'cashAccount',
    sorter: () => -1,
    render: (cashAccount: { name: string }) => {
      return <p>{cashAccount?.name}</p>
    },
    key: 'cashAccount',
  },
  requested_by: {
    title: 'Registrado por',
    dataIndex: 'created_by',
    key: 'requested_by',
    sorter: () => -1,
  },
  approved_by: {
    title: 'Aprobado por',
    dataIndex: 'approved_by',
    key: 'approved_by',
    sorter: () => -1,
  },
  rejected_by: {
    title: 'Rechazado por',
    dataIndex: 'rejected_by',
    key: 'rejected_by',
    sorter: () => -1,
  },
  approved_at: {
    title: 'Aprobado',
    dataIndex: 'approved_at',
    key: 'approved_at',
    sorter: () => -1,
    render: (date: string) => {
      return <p className="min-w-max">{fDate(date)}</p>
    },
  },
  rejected_at: {
    title: 'Rechazado',
    dataIndex: 'rejected_at',
    key: 'rejected_at',
    sorter: () => -1,
    render: (date: string) => {
      return <p>{fDate(date)}</p>
    },
  },
  amount: {
    title: 'Monto',
    dataIndex: 'amount',
    sorter: () => -1,
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
    sorter: () => -1,
    __cellType__: 'TypeNumeric',
    excelRender: (amount: number) => {
      return amount
    },
  },
  costCenter: {
    title: 'Centro de costo',
    dataIndex: ['costCenter', 'origin'],
    key: 'cost_center',
    sorter: () => -1,
  },
  payMethod: {
    title: 'Metodo de pago',
    dataIndex: 'pay_method',
    key: 'pay_method',
    sorter: () => -1,
  },
  currency: {
    title: 'Moneda',
    dataIndex: 'currency',
    sorter: () => -1,
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
    columnsTable.num_document,
    columnsTable.description,
    columnsTable.cash,
    // columnsTable.costCenter,
    columnsTable.payMethod,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.currency,
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
    columnsTable.currency,
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
    columnsTable.currency,
    columnsTable.icon,
  ],
  default: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.num_document,
    columnsTable.description,
    columnsTable.category,
    columnsTable.cash,
    columnsTable.costCenter,
    columnsTable.approved_by,
    columnsTable.approved_at,
    columnsTable.amount,
    columnsTable.currency,
    columnsTable.icon,
  ],
}

export const columnsRequested = {
  supplier: [
    columnsTable.id,
    columnsTable.requested_at,
    columnsTable.legal_name,
    columnsTable.num_document,
    columnsTable.description,
    columnsTable.category,
    // columnsTable.costCenter,
    columnsTable.payMethod,
    columnsTable.requested_by,
    columnsTable.amount,
    columnsTable.currency,
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
    columnsTable.currency,
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
