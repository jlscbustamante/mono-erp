import { Drawer, Table } from 'antd'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

import { approvedTypeFilterSt } from '@/data/requests/state/filters'
import {
  approvedRequestsSt,
  sumApprovedRequestsSt,
} from '@/data/requests/state/requests'
import { IFilteredRequest, RequestType } from '@/data/requests/types'

import { columnsApproved, FooterBalance, ReadOnlyForm } from './components'
import { RequestsFilters, TypeNavigation } from './components/approved'

export default function Approved() {
  const sumApprovedRequests = useRecoilValue(sumApprovedRequestsSt)
  const [selectedRequest, setSelectedRequest] =
    useState<IFilteredRequest | null>(null)

  return (
    <>
      <div className="container mx-auto p-3 pt-0">
        <RequestsFilters />
        <TypeNavigation />
        <TableApproved
          onSelect={(record: IFilteredRequest) => {
            setSelectedRequest(record)
          }}
        />
        <FooterBalance info={sumApprovedRequests} />
      </div>
      {selectedRequest && (
        <Drawer
          title={`Requerimiento`}
          open={true}
          onClose={() => {
            setSelectedRequest(null)
          }}
          width={450}
        >
          <ReadOnlyForm
            request={selectedRequest}
            setRequest={setSelectedRequest}
          />
        </Drawer>
      )}
    </>
  )
}

const TableApproved: React.FC<{
  onSelect: (record: IFilteredRequest) => void
}> = ({ onSelect }) => {
  const approvedRequests = useRecoilValue(approvedRequestsSt)
  const typeFilter = useRecoilValue(approvedTypeFilterSt)
  let cols = []
  switch (typeFilter) {
    case RequestType.Supplier:
      cols = columnsApproved.supplier
      break
    case RequestType.Transfer:
      cols = columnsApproved.transfer
      break
    default:
      cols = columnsApproved.default
      break
  }

  return (
    <div>
      <Table
        dataSource={approvedRequests}
        showSorterTooltip={false}
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
