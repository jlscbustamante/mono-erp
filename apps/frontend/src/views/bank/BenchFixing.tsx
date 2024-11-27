import { Drawer, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import * as sdk from '@/data/bank/sdk'
import {
  bankReconciliationsSt,
  selectedReconciliationSt,
} from '@/data/bank/state'
import { IBankReconciliation } from '@/data/bank/types'
import { fCurrency } from '@/utils'

import { SearchRequests } from './components/SearchRequest'

export default function BenchFixing() {
  return (
    <div className="p-3">
      <TablePendings />
    </div>
  )
}

export const TablePendings = () => {
  const [openSearch, setOpenSearch] = useState(false)
  const [bankReconciliation, setBankReconciliation] = useRecoilState(
    bankReconciliationsSt,
  )
  const [selectedReconciliation, setSelectedReconciliation] = useRecoilState(
    selectedReconciliationSt,
  )

  const onCloseDrawer = () => {
    setOpenSearch(false)
    setSelectedReconciliation(null)
  }

  const columns: ColumnsType<IBankReconciliation> = [
    { title: 'Fecha', dataIndex: 'bnk_date' },
    {
      title: 'Descripción',
      dataIndex: 'bnk_reference',
      render: (reference: string, record: IBankReconciliation) => {
        return (
          <span>
            {record.bnk_operation_text} {reference ? '-' : ''}{' '}
            {record.bnk_reference}
          </span>
        )
      },
    },
    {
      title: 'Requerimiento',
      dataIndex: 'req_id',
      onCell: (record: IBankReconciliation) => {
        return {
          className: 'cursor-pointer hover:!bg-gray-100',
          onClick: () => {
            setSelectedReconciliation(record)
            setOpenSearch(true)
          },
        }
      },
    },
    { title: 'Usuario', dataIndex: 'bnk_user' },
    {
      title: 'Monto',
      dataIndex: 'bnk_amount',
      render: (value) => fCurrency(value),
    },
    {
      title: 'Saldo',
      dataIndex: 'bnk_balance',
      render: (value) => fCurrency(value),
    },
  ]

  useEffect(() => {
    ;(async () => {
      const data = await sdk.firstPendingReconciliation()
      setBankReconciliation(data)
    })()
  }, [])

  return (
    <div>
      <Table
        rowKey={(record) => record.transactionkey}
        dataSource={bankReconciliation}
        columns={columns}
        pagination={false}
      />
      <Drawer
        title="Buscar requerimiento"
        placement="bottom"
        height={'90%'}
        open={openSearch}
        onClose={() => {
          setOpenSearch(false)
          setSelectedReconciliation(null)
        }}
      >
        {selectedReconciliation && (
          <SearchRequests
            selectedRequest={selectedReconciliation}
            onClose={onCloseDrawer}
          />
        )}
      </Drawer>
    </div>
  )
}
