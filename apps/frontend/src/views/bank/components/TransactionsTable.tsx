import { Drawer } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  bankReconciliationsSt,
  selectedReconciliationSt,
} from '@/data/bank/state'
import { IBankReconciliation } from '@/data/bank/types'

import { SearchRequests } from './SearchRequest'

export const TransactionsTable: React.FC<{
  columns: ColumnsType<IBankReconciliation>
}> = ({ columns }) => {
  const [openSearch, setOpenSearch] = useState(false)
  const bankReconciliation = useRecoilValue(bankReconciliationsSt)
  const [selectedReconciliation, setSelectedReconciliation] = useRecoilState(
    selectedReconciliationSt,
  )
  const [idLastSelected, setIdLastSelected] = useState('')

  const onCloseDrawer = (transactionkey?: string) => {
    setOpenSearch(false)
    if (transactionkey) {
      setIdLastSelected(transactionkey)
      setTimeout(() => {
        setIdLastSelected('')
      }, 2000)
    }
    setSelectedReconciliation(null)
  }

  return (
    <div>
      <Table
        rowKey={(record) => record.transactionkey}
        dataSource={bankReconciliation}
        columns={columns}
        pagination={false}
        size="small"
        onRow={(record) => {
          const isSelected = record.transactionkey === idLastSelected
          return {
            className: `cursor-pointer hover:!bg-gray-100 ${
              isSelected ? 'bg-blue-300' : ''
            }`,
            onClick: () => {
              setSelectedReconciliation(record)
              setOpenSearch(true)
            },
          }
        }}
      />
      <Drawer
        title="Conciliar requerimiento con movimiento de banco"
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
