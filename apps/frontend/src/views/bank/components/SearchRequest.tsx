import { Button, Table } from 'antd'
import { add, format, parseISO, sub } from 'date-fns'
import { useEffect, useState } from 'react'
import { BiSolidFilePdf } from 'react-icons/bi'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { NOTIFICATION } from '@/const/notification'
import * as bankSdk from '@/data/bank/sdk'
import { bankReconciliationsSt } from '@/data/bank/state'
import { IBankReconciliation } from '@/data/bank/types'
import {
  getFilterTypesForKey,
  validFieldsOptionsBanckFix,
} from '@/data/requests/const'
import * as sdk from '@/data/requests/sdk'
import {
  IFilteredRequest,
  IRequest,
  RequestStatus,
} from '@/data/requests/types'
import {
  cashAccountRequestSt,
  categoriesRequestSt,
} from '@/data/resources/state'
import { Filters, OpFilter } from '@/data/types/Filters'
import { fCurrency, safeAny } from '@/utils'
import { fDate } from '@/utils/formatDate'
import { openDocsUrls } from '@/utils/openDocsUrls'

export const SearchRequests: React.FC<{
  selectedRequest: IBankReconciliation
  onClose: (transactionkey?: string) => void
}> = ({ selectedRequest, onClose }) => {
  const [loading, setLoading] = useState(false)

  const startDate = format(
    sub(parseISO(selectedRequest.bnk_date), { days: 1 }),
    'yyyy-MM-dd',
  )
  const endDate = format(
    add(parseISO(selectedRequest.bnk_date), { days: 1 }),
    'yyyy-MM-dd',
  )
  const initialAmount = Number((selectedRequest.bnk_amount - 70).toFixed(2))
  const [userFilters, setUserFilters] = useState<Filters<IRequest>>({
    amount: [
      OpFilter.Range,
      initialAmount < 0 ? '0' : initialAmount,
      (selectedRequest.bnk_amount + 10).toFixed(2),
    ],
    approved_at: [OpFilter.RangeDate, startDate, endDate],
  })
  const [requests, setRequests] = useState<IFilteredRequest[]>([])
  const categories = useRecoilValue(categoriesRequestSt)
  const cashAccounts = useRecoilValue(cashAccountRequestSt)
  const [bankReconciliation, setBankReconciliation] = useRecoilState(
    bankReconciliationsSt,
  )

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Solicitado',
      dataIndex: 'requested_at',
      key: 'requested_at',
      render: (date: string) => {
        return <p>{fDate(date)}</p>
      },
    },
    {
      title: 'Proveedor',
      dataIndex: 'legal_name',
      key: 'legal_name',
    },
    {
      title: 'Detalle',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Caja',
      dataIndex: 'cashAccount',
      render: (cashAccount: { name: string }) => {
        return <p>{cashAccount?.name}</p>
      },
      key: 'cashAccount',
    },
    {
      title: 'Aprobado por',
      dataIndex: 'approved_by',
      key: 'approved_by',
    },
    {
      title: 'Aprobado',
      dataIndex: 'approved_at',
      key: 'approved_at',
      render: (date: string) => {
        return <p>{fDate(date)}</p>
      },
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      key: 'amount',
      defaultSortOrder: 'descend',
      sorter: (a: IRequest, b: IRequest) => a.amount - b.amount,
      render: (amount: number) => {
        return <p className="text-right">{fCurrency(amount, false)}</p>
      },
    },
    {
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
    {
      title: 'Acciones',
      key: 'action',
      render: (record: IFilteredRequest) => {
        return (
          <a
            onClick={() => handleSelectedRequest(record)}
            className="text-right cursor-pointer"
          >
            Conciliar
          </a>
        )
      },
    },
  ]

  const handleSelectedRequest = async (request: IFilteredRequest) => {
    try {
      const positionIndex = bankReconciliation.findIndex(
        (el) => el.transactionkey == selectedRequest.transactionkey,
      )
      if (positionIndex < 0) {
        throw new Error(
          'Ocurrio un error al relacionar tu seleccion con la lista',
        )
      }
      const newSelected: IBankReconciliation = {
        ...selectedRequest,
        req_amount: request.amount.toString(),
        req_id: request.id,
        req_description: request.description,
      }
      setBankReconciliation([
        ...bankReconciliation.slice(0, positionIndex),
        newSelected,
        ...bankReconciliation.slice(positionIndex + 1),
      ])
      await bankSdk.reconcile(selectedRequest.transactionkey, {
        requirement_amount: request.amount,
        requirement_id: request.id,
        requirement_description: request.description,
      })
      toast.info('Requerimiento conciliado', {
        ...NOTIFICATION.info,
        position: 'top-left',
      })
      onClose(selectedRequest.transactionkey)
    } catch (err: any) {
      toast.error(err.message, { ...NOTIFICATION.error, autoClose: false })
    }
  }

  const validateFilters = () => {
    if (!userFilters.approved_at && !userFilters.created_at) {
      throw new Error('Por favor agrega un filtro de fecha')
    }
  }

  const filterRequest = async () => {
    try {
      setLoading(true)
      validateFilters()
      const requests = await sdk.requests({
        ...userFilters,
        status: [OpFilter.NotEqual, RequestStatus.Rejected],
      })
      setRequests(requests)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterRequest()
  }, [])

  return (
    <div>
      <div>
        <p className="font-bold mb-3">
          Movimiento de banco : Fecha {selectedRequest.bnk_date}; Monto{' '}
          {selectedRequest.bnk_amount} ; Descripción{' '}
          {selectedRequest.bnk_operation_text}
        </p>
        <div className="flex gap-1 mb-2">
          <Button type="primary" onClick={filterRequest} loading={loading}>
            Aplicar filtros
          </Button>
          <FilterAddButton
            userFilters={userFilters}
            setUserFilters={setUserFilters}
            getFilterTypesForKey={getFilterTypesForKey}
            items={validFieldsOptionsBanckFix()}
          />
          <UserFilters
            userFilters={userFilters}
            setFilters={setUserFilters}
            getFilterTypesForKey={getFilterTypesForKey}
            items={validFieldsOptionsBanckFix()}
            selections={{
              category_id: categories.map((el) => ({
                label: el.name,
                value: el.id,
              })),
              cash_id: cashAccounts.map((el) => ({
                label: el.name,
                value: el.id,
              })),
              category_id_cash: cashAccounts.map((el) => ({
                label: el.name,
                value: el.id,
              })),
            }}
          />
        </div>
      </div>
      <Table
        rowKey={(record) => record.id}
        dataSource={requests}
        columns={columns as safeAny}
        size="small"
        title={() => 'Requerimientos'}
        pagination={{
          pageSize: 50,
          showSizeChanger: false,
        }}
      />
    </div>
  )
}
