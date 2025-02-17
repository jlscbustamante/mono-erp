import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterIParameter,
  filterParameterSt,
} from '@/data/maintenance/Parameters/state/parameter'
import { IParameter } from '@/data/maintenance/Parameters/type/Parameters'
import { ParametersStatus } from '@/data/maintenance/Parameters/type/status'
import { transformFilterToValidParameter } from '@/data/maintenance/Parameters/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/Parameters/forms/Create'
import { RequestsFilters } from '../components/Parameters/forms/FilterControl'
import { UpdateForm } from '../components/Parameters/forms/Update'

export const GetParameters = () => {
  const [data, setData] = useState<IParameter[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | IParameter>(
    null,
  )
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterParameterSt)
  const setApprovedRequests = useSetRecoilState(filterIParameter)
  const applyFilters = async () => {
    try {
      const filters: Filters<IParameter> = {}
      const validFilterUsers = transformFilterToValidParameter(userFilters)
      const data = await sdk.filterParameter({
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
      const filters: Filters<IParameter> = {}

      filters.status = [OpFilter.In, ParametersStatus.Active]

      setUserFilters({})
      const data = await sdk.filterParameter({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<IParameter> = {}

        filters.status = [OpFilter.In, ParametersStatus.Active]

        const validFilterUsers = transformFilterToValidParameter(userFilters)
        const data = await sdk.filterParameter({
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

  const handleEditClick = (record: IParameter) => {
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
        title={`Nuevo parametro`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            parameter={selectedRequest}
            setParameter={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar parametro`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {' '}
        {isUpdateFormVisible && (
          <UpdateForm
            setParameter={setSelectedRequest}
            parameter={selectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}
const RequirementsFound: React.FC<{
  requests: IParameter[]
  setSelectedRequest: (request: IParameter | null) => void
  handleEditClick: (record: IParameter) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterIParameter)
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
      sorter: (a, b) => a.id! - b.id!,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 600,
      sorter: (a, b) => a.type?.localeCompare(b.type ?? '') ?? -1,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name?.localeCompare(b.name ?? '') ?? -1,
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      width: 110,
      sorter: () => -1,
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      width: 80,
      sorter: (a, b) => a.role?.localeCompare(b.role ?? '') ?? -1,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      sorter: (a, b) => a.status?.localeCompare(b.status ?? '') ?? -1,
      render: (text: string) => (
        <span>{text == '1' ? 'Activo' : 'Inactivo'}</span>
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
  ] satisfies ColumnsType<IParameter>

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

export default GetParameters
