import * as sdk from '@/data/requests/sdk'
import { Button, DatePicker, Drawer, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FaFilePdf } from 'react-icons/fa6'
import { useRecoilState } from 'recoil'

import { IFilteredRequest, IRequest, RequestType } from '@/data/requests/types'
import { fCurrency } from '@/utils'
import { openDocsUrls } from '@/utils/openDocsUrls'
import { safeAny } from '@/utils/someAny'

import { FilterAddButton, UserFilters } from '@/components'
import {
  getFilterTypesForKey,
  validFieldsOptionsPending,
} from '@/data/requests'
import { Filters, OpFilter } from '@/data/types/Filters'
import { useQuery } from '@tanstack/react-query'
import { FormUploadDocument } from './components/FormUploadDocument'
import { filterRequirementsSt, uploadStore } from './filter-upload'

const { RangePicker } = DatePicker

export default function UploadToRequest() {
  const [requests, setRequests] = useState<IFilteredRequest[]>([])
  const [selectedRequest, setSelectedRequest] =
    useState<null | IFilteredRequest>(null)

  return (
    <div className="container mx-auto p-3">
      <FiltersRc setRequests={setRequests} />
      <RequirementsFound
        requests={requests}
        setSelectedRequest={setSelectedRequest}
      />
      {selectedRequest && (
        <Drawer
          title="Subir archivo a requerimiento"
          open={true}
          onClose={() => {
            setSelectedRequest(null)
          }}
        >
          <FormUploadDocument
            selectedRequest={selectedRequest}
            onFinish={() => {
              setSelectedRequest(null)
            }}
          />
        </Drawer>
      )}
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: IFilteredRequest[]
  setSelectedRequest: safeAny
}> = ({ requests, setSelectedRequest }) => {
  const columns: ColumnsType<IFilteredRequest> | undefined = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id! - b.id!,
    },
    {
      title: 'Fecha solicitada',
      dataIndex: 'requested_at',
      key: 'date',
      render: (text: string) => text.split(' ')[0],
      sorter: (a, b) =>
        dayjs(a.requested_at).unix() - dayjs(b.requested_at).unix(),
    },
    {
      title: 'Tipo',
      dataIndex: 'request_type',
      key: 'supplier',
      render: (type: RequestType) => {
        if (type == RequestType.Simple) return 'Simple'
        else if (type == RequestType.Supplier) return 'Proveedor'
        else if (type == RequestType.Transfer) return 'Transferencia'
        else if (type == RequestType.Liquidation) return 'Liquidación'
      },
      sorter: (a, b) => a.request_type.localeCompare(b.request_type),
    },
    {
      title: 'Detalle',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Proveedor',
      dataIndex: 'legal_name',
      sorter: (a, b) => a.legal_name?.localeCompare(b.legal_name ?? '') ?? -1,
    },
    {
      title: 'N° Doc',
      dataIndex: 'legal_number',
      sorter: (a, b) =>
        a.legal_number?.localeCompare(b.legal_number ?? '') ?? -1,
    },
    {
      title: 'Monto',
      dataIndex: 'amount',
      render: (amount: number) => fCurrency(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: <FaFilePdf className="w-4 h-auto" />,
      render: (_, record: IFilteredRequest) => {
        const docs = record.doc_url?.split(',').filter((doc) => doc) ?? []
        if (docs.length == 0)
          return (
            <FaFilePdf className="text-slate-400 w-5 h-auto hover:cursor-not-allowed" />
          )
        return (
          <FaFilePdf
            className="text-slate-800 w-5 h-auto"
            onClick={() => {
              openDocsUrls(record.doc_url)
            }}
          />
        )
      },
    },
  ]
  return (
    <Table
      columns={columns}
      dataSource={requests}
      pagination={false}
      rowKey={'id'}
      onRow={(record: IFilteredRequest) => {
        return {
          style: { cursor: 'pointer' },
          onClick: () => {
            setSelectedRequest(record)
          },
        }
      }}
    />
  )
}

const FiltersRc: React.FC<{ setRequests: safeAny }> = ({ setRequests }) => {
  const date = uploadStore((st) => st.date)
  const setDate = uploadStore((st) => st.setDate)
  const [filters, setFilters] = useRecoilState(filterRequirementsSt)

  const { data: categories } = useQuery({
    queryKey: ['up:req-found-cat'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      return await sdk.categories()
    },
  })

  const { data: cashAccounts } = useQuery({
    queryKey: ['up:req-found-cash'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      return await sdk.cashAccount()
    },
  })

  const { data: costCenters } = useQuery({
    queryKey: ['up:req-found-cost'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      return await sdk.costCenters()
    },
  })

  const handlerFilter = async () => {
    const searchFilters: Filters<IRequest> = {
      ...filters,
      requested_at: [OpFilter.RangeDate, date[0], date[1]],
    }
    console.log('filters: ', searchFilters)

    // try {
    //   const filters: Filters<IRequest> = {
    //     requested_at: [
    //       OpFilter.RangeDate,
    //       filterRequest.date[0],
    //       filterRequest.date[1],
    //     ],
    //     status: [OpFilter.NotEqual, RequestStatus.Rejected],
    //   }

    //   if (filterRequest.supplier)
    //     filters.legal_name = [OpFilter.Contain, filterRequest.supplier]
    //   if (filterRequest.ruc)
    //     filters.legal_number = [OpFilter.Contain, filterRequest.ruc]
    //   if (filterRequest.num_doc)
    //     filters.num_document = [OpFilter.Contain, filterRequest.num_doc]
    //   if (filterRequest.id) filters.id = [OpFilter.Equal, filterRequest.id]
    //   const requestsFound = await sdk.requests(filters)
    //   setRequests(requestsFound)
    // } catch (err: any) {
    //   toast.error(err.message, NOTIFICATION.error)
    // }
  }

  return (
    <div className="flex gap-2 my-4">
      <RangePicker
        value={[dayjs(date[0]), dayjs(date[1])]}
        allowClear={false}
        onChange={(e: safeAny) => {
          setDate([e[0].format('YYYY-MM-DD'), e[1].format('YYYY-MM-DD')])
        }}
        style={{ width: '250px' }}
      />
      <FilterAddButton
        userFilters={filters}
        setUserFilters={setFilters}
        getFilterTypesForKey={getFilterTypesForKey}
        items={validFieldsOptionsPending()}
      />
      <UserFilters
        userFilters={filters}
        setFilters={setFilters}
        getFilterTypesForKey={getFilterTypesForKey}
        items={validFieldsOptionsPending()}
        selections={{
          category_id:
            categories?.map((el) => ({
              label: el.name,
              value: el.id,
            })) ?? [],
          cash_id:
            cashAccounts?.map((el) => ({
              label: el.name,
              value: el.id,
            })) ?? [],
          category_id_cash:
            cashAccounts?.map((el) => ({
              label: el.name,
              value: el.id,
            })) ?? [],
          cost_center_id:
            costCenters?.map((el) => ({
              label: el.origin,
              value: el.id,
            })) ?? [],
        }}
      />
      {/* <Input
        placeholder="Id requerimiento"
        className="w-96"
        value={filterRequest.id ?? ''}
        onChange={(e) =>
          setFilterRequest({
            ...filterRequest,
            id: e.target.value ? Number(e.target.value) : null,
          })
        }
      />
      <Input
        placeholder="Proveedor"
        className="w-96"
        value={filterRequest.supplier ?? ''}
        onChange={(e) =>
          setFilterRequest({ ...filterRequest, supplier: e.target.value })
        }
      />
      <Input
        placeholder="RUC"
        className="w-96"
        value={filterRequest.ruc ?? ''}
        onChange={(e) =>
          setFilterRequest({ ...filterRequest, ruc: e.target.value })
        }
      />
      <Input
        placeholder="N° Doc"
        className="w-96"
        value={filterRequest.num_doc ?? ''}
        onChange={(e) =>
          setFilterRequest({ ...filterRequest, num_doc: e.target.value })
        }
      /> */}
      <Button type="primary" onClick={handlerFilter}>
        Buscar requerimiento
      </Button>
    </div>
  )
}
