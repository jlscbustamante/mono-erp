import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  cashAccountsSt,
  filterCashAccountSt,
} from '@/data/cashAccount/state/cashAccount'
import { CashAccountStatus } from '@/data/cashAccount/types'
import { ICashAccount } from '@/data/cashAccount/types/cashAccount'
import { transformFilterToValid } from '@/data/cashAccount/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { CreateFormCash } from '../components/CashAccount/forms/CreateForm'
import { RequestsFilters } from '../components/CashAccount/forms/FiltersControl'
import { UpdateFormCash } from '../components/CashAccount/forms/UpdateForm'

export const GetCashAccount = () => {
  const [data, setData] = useState<ICashAccount[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ICashAccount>(
    null,
  )

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(cashAccountsSt)

  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterCashAccountSt)

  const applyFilters = async () => {
    try {
      const filters: Filters<ICashAccount> = {}
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.filterCashAccount({
        ...filters,
        ...validFilterUsers,
      })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  const cleanFilters = async () => {
    try {
      const filters: Filters<ICashAccount> = {}

      filters.status = [OpFilter.In, CashAccountStatus.Active]

      setUserFilters({})
      const data = await sdk.filterCashAccount({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ICashAccount> = {}

        filters.status = [OpFilter.In, CashAccountStatus.Active]

        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterCashAccount({
          ...filters,
          ...validFilterUsers,
        })
        setApprovedRequests(data)
        setData(data)
      } catch (err: any) {
        toast.error(err.message, NOTIFICATION.error)
      }
    })()
  }, [])

  const handleAddClick = () => {
    setIsDrawerVisible(true)
  }

  const handleDrawerClose = () => {
    setSelectedRequest(null)
    setIsDrawerVisible(false)
  }

  const handleDrawerCloseUpdate = () => {
    setSelectedRequest(null)
    setIsUpdateFormVisible(false)
  }

  const handleEditClick = (record: ICashAccount) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }
  return (
    <div className="container mx-auto" style={{ marginTop: '-15px' }}>
      <div className="flex items-center gap-1.5 justify-between my-1 mt-1">
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
        />
        <Button type="primary" onClick={handleAddClick}>
          Nuevo
        </Button>
      </div>
      <RequirementsFound
        requests={data}
        setSelectedRequest={setSelectedRequest}
        handleEditClick={handleEditClick}
      />
      <Drawer
        title={`Nueva cuenta de caja`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateFormCash
            cashAccount={selectedRequest}
            setCashAccount={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar cuenta de caja`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateFormCash
            cashAccount={selectedRequest}
            setCashAccount={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ICashAccount[]
  setSelectedRequest: (request: ICashAccount | null) => void
  handleEditClick: (record: ICashAccount) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(cashAccountsSt)

  const sortedData = [...data].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0)

    return dateB.getTime() - dateA.getTime()
  })
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: 'Cuenta',
      dataIndex: ['account', 'account'],
      key: 'account_id',
      width: 200,
    },
    {
      dataIndex: 'account_id',
      key: 'account_id',
    },
    {
      title: 'Tipo de caja',
      dataIndex: ['cash_account_type', 'name'],
      key: 'type_cash_id',
      width: 150,
    },

    {
      title: 'Estado',
      width: 80,
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <span>{text == 'A' ? 'Activo' : 'Inactivo'}</span>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'editar',
      width: 15,
      render: (_text: any, record: any) => (
        <MdEdit
          onClick={() => handleEditClick(record)}
          style={{
            fontSize: '20px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
          className="icon"
        />
      ),
    },
  ]

  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        size="small"
        style={{ marginTop: '-15px' }}
      />
    </div>
  )
}

export default GetCashAccount
