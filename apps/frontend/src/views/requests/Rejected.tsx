import { Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/requests/sdk'
import {
  countFiltersRejectedSt,
  dateRejectedFilterSt,
  filtersUserRejectedSt,
  rejectedTypeFilterSt,
} from '@/data/requests/state/filters'
import {
  rejectedRequestsSt,
  sumRejectedRequestsSt,
} from '@/data/requests/state/requests'
import {
  IFilteredRequest,
  IRequest,
  RequestStatus,
  RequestType,
} from '@/data/requests/types'
import { Filters, OpFilter } from '@/data/types/Filters'

import { columnsRejected, FooterBalance } from './components'
import { ReadOnlyForm } from './components/Readonly'
import { RequestsFilters, TypeNavigation } from './components/rejected'
import { transformFilterToValid } from './utils'

export default function Rejected() {
  const setApprovedRequests = useSetRecoilState(rejectedRequestsSt)
  const typeFilter = useRecoilValue(rejectedTypeFilterSt)
  const dates = useRecoilValue(dateRejectedFilterSt)
  const sumRejectedRequests = useRecoilValue(sumRejectedRequestsSt)
  const [selectedRequest, setSelectedRequest] =
    useState<IFilteredRequest | null>(null)
  const [filtersUser, setFilterUsers] = useRecoilState(filtersUserRejectedSt)
  const setCountFilters = useSetRecoilState(countFiltersRejectedSt)

  const filterBase: Filters<IRequest> = {
    rejected_at: [OpFilter.RangeDate, dates[0], dates[1]],
    status: [OpFilter.In, RequestStatus.Rejected],
    request_type: [OpFilter.Equal, typeFilter],
  }

  const countResponsesFilter = async (filters: Filters<IRequest>) => {
    try {
      const newFilt = Object.assign({}, filters)
      delete newFilt.request_type
      const resultNum = await sdk.countRequests(newFilt)
      setCountFilters(resultNum)
    } catch (err: any) {
      console.log('Error conteo filtros')
    }
  }

  const applyFilters = async () => {
    try {
      const validFilterUsers = transformFilterToValid(filtersUser)
      const data = await sdk.requests({ ...filterBase, ...validFilterUsers })
      countResponsesFilter({ ...filterBase, ...validFilterUsers })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const cleanFilters = async () => {
    try {
      const filters: Filters<IRequest> = {}
      filters.rejected_at = [OpFilter.RangeDate, dates[0], dates[1]]
      filters.status = [OpFilter.In, ...status]
      filters.request_type = [OpFilter.Equal, typeFilter]
      setFilterUsers({})
      const data = await sdk.requests({ ...filters })
      countResponsesFilter({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [typeFilter])

  return (
    <>
      <div className="container mx-auto p-3 pt-0">
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
        />
        <TypeNavigation />
        <TableRequested
          onSelect={(record: IFilteredRequest) => {
            setSelectedRequest(record)
          }}
        />
        <FooterBalance info={sumRejectedRequests} />
      </div>
      {selectedRequest && (
        <Drawer
          title={`Requerimiento rechazado`}
          open={true}
          onClose={() => {
            setSelectedRequest(null)
          }}
          width={440}
        >
          <ReadOnlyForm
            request={selectedRequest}
            setRequest={setSelectedRequest}
            showUnsign={false}
          />
        </Drawer>
      )}
    </>
  )
}

const TableRequested: React.FC<{
  onSelect: (record: IFilteredRequest) => void
}> = ({ onSelect }) => {
  const rejectedRequests = useRecoilValue(rejectedRequestsSt)
  const typeFilter = useRecoilValue(rejectedTypeFilterSt)
  let cols = []
  switch (typeFilter) {
    case RequestType.Supplier:
      cols = columnsRejected.supplier
      break
    case RequestType.Transfer:
      cols = columnsRejected.transfer
      break
    default:
      cols = columnsRejected.default
      break
  }
  return (
    <div>
      <Table
        dataSource={rejectedRequests}
        onRow={(record) => ({
          onClick: () => {
            onSelect(record)
          },
          style: { cursor: 'pointer' },
        })}
        columns={cols}
        pagination={false}
        rowKey={(record) => record.id}
        size="small"
      />
    </div>
  )
}
