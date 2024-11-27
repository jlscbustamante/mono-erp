import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterCashAccountType,
  filterCashAccountTypeSt,
} from '@/data/cashAccount/state/cashAccountType'
import {
  IFilterCashAccountType,
  ITypeCashAccount,
} from '@/data/cashAccount/types/cashTypes'
import { TypeCashAccountStatus } from '@/data/cashAccount/types/statusType'
import {
  transformFilterToValid,
  transformFilterToValidType,
} from '@/data/cashAccount/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { CreateForm } from '../components/CashAccountType/forms/CreateForm'
import { RequestsFilters } from '../components/CashAccountType/forms/FilterControl'
import { UpdateForm } from '../components/CashAccountType/forms/UpdateForm'
export const GetTypeCashAccountType = () => {
  const [data, setData] = useState<ITypeCashAccount[]>([])
  const [selectedRequest, setSelectedRequest] =
    useState<null | ITypeCashAccount>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(filterCashAccountTypeSt)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterCashAccountType)

  const applyFilters = async () => {
    try {
      const filters: Filters<ITypeCashAccount> = {}
      const validFilterUsers = transformFilterToValidType(userFilters)
      const data = await sdk.filterCashAccountType({
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
      const filters: Filters<ITypeCashAccount> = {}

      filters.status = [OpFilter.In, TypeCashAccountStatus.Active]

      setUserFilters({})
      const data = await sdk.filterCashAccountType({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ITypeCashAccount> = {}

        filters.status = [OpFilter.In, TypeCashAccountStatus.Active]

        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterCashAccountType({
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
  const handleEditClick = (record: ITypeCashAccount) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }
  const handleDrawerCloseUpdate = () => {
    setSelectedRequest(null)
    setIsUpdateFormVisible(false)
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
        title={`Nuevo tipo de cuenta de caja`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            cashAccountType={selectedRequest}
            setCashAccountType={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar tipo de cuenta de caja`}
        open={isUpdateFormVisible}
        onClose={() => setIsUpdateFormVisible(false)}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            cashAccountType={selectedRequest}
            setCashAccountType={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ITypeCashAccount[]
  setSelectedRequest: (request: ITypeCashAccount | null) => void
  handleEditClick: (record: ITypeCashAccount) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterCashAccountTypeSt)
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
      title: 'Tipo ID',
      dataIndex: 'type_id',
      key: 'type_id',
      width: 150,
      render: (text: string, record: IFilterCashAccountType) => {
        const label = `${record.name} / ${text}`
        return <span>{label}</span>
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
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
    <Table
      pagination={false}
      columns={columns}
      dataSource={data}
      rowKey="id"
      size="small"
      style={{ marginTop: '-15px' }}
    />
  )
}
export default GetTypeCashAccountType
