import { Drawer, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

import { IFilteredRequest, RequestType } from '@/data/requests'
import { pendingTypeFilterSt } from '@/data/requests/state/filters'
import {
  pendingRequestsSt,
  sumPendingRequestsSt,
} from '@/data/requests/state/requests'
import { TypeNavigation } from '@/views/requests/components/'

import { columnsRequested, FooterBalance } from './components'
import { RequestsFilters } from './components/requested'
import { UpdateForm } from './components/requested/UpdateForm'

export default function Requested() {
  const typeFilter = useRecoilValue(pendingTypeFilterSt)
  const sumPendingRequests = useRecoilValue(sumPendingRequestsSt)

  const [selectedRequest, setSelectedRequest] =
    useState<IFilteredRequest | null>(null)

  return (
    <>
      <div className="container mx-auto p-3 pt-0">
        <RequestsFilters />
        <TypeNavigation />
        <TableRequested
          typeFilter={typeFilter}
          onSelect={(record: IFilteredRequest) => {
            setSelectedRequest(record)
          }}
        />
        <FooterBalance info={sumPendingRequests} />
      </div>
      {selectedRequest && (
        <Drawer
          title={`Editar requerimiento`}
          open={true}
          onClose={() => {
            setSelectedRequest(null)
          }}
          width={440}
        >
          <UpdateForm
            request={selectedRequest}
            setRequest={setSelectedRequest}
          />
        </Drawer>
      )}
    </>
  )
}

const TableRequested: React.FC<{
  typeFilter: RequestType
  onSelect: (record: IFilteredRequest) => void
}> = ({ typeFilter, onSelect }) => {
  const pendingRequests = useRecoilValue(pendingRequestsSt)

  let cols: ColumnsType<IFilteredRequest> = []
  switch (typeFilter) {
    case RequestType.Supplier:
      cols = columnsRequested.supplier
      break
    case RequestType.Transfer:
      cols = columnsRequested.transfer
      break
    default:
      cols = columnsRequested.default
      break
  }

  return (
    <div>
      <Table
        onRow={(record) => ({
          onClick: () => {
            onSelect(record)
          },
          style: { cursor: 'pointer' },
        })}
        dataSource={pendingRequests}
        columns={cols}
        pagination={false}
        rowKey={(record) => record.id}
        size="small"
      />
    </div>
  )
}
