import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterISucursal,
  filterSucursalSt,
} from '@/data/maintenance/Sucursal/state/filters'
import { SucursalStatus } from '@/data/maintenance/Sucursal/status/status'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import { transformFilterToValid } from '@/data/maintenance/Sucursal/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/Sucursal/forms/Create'
import { RequestsFilters } from '../components/Sucursal/forms/FilterControl'
import { UpdateForm } from '../components/Sucursal/forms/Update'
export const GetSucursal = () => {
  const [data, setData] = useState<ISucursal[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ISucursal>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterSucursalSt)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(filterISucursal)
  const applyFilters = async () => {
    try {
      const filters: Filters<ISucursal> = {}
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.filterSucursal({
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
      const filters: Filters<ISucursal> = {}

      filters.status = [OpFilter.In, SucursalStatus.Active]

      setUserFilters({})
      const data = await sdk.filterSucursal({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ISucursal> = {}

        filters.status = [OpFilter.In, SucursalStatus.Active]

        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterSucursal({
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

  const handleEditClick = (record: ISucursal) => {
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
        title={`Nueva tienda`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            sucursal={selectedRequest}
            setSucursal={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar tienda`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            sucursal={selectedRequest}
            setSucursal={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ISucursal[]
  setSelectedRequest: (request: ISucursal | null) => void
  handleEditClick: (record: ISucursal) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterISucursal)
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
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Tienda',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },

    {
      title: 'Direccion',
      dataIndex: 'ubi_address',
      key: 'ubi_address',
      sorter: () => -1,
    },

    {
      title: 'Distrito',
      dataIndex: 'ubi_district',
      key: 'ubi_district',
      sorter: () => -1,
    },
    {
      title: 'Tipo de tienda',
      dataIndex: 'type_sede',
      key: 'type_sede',
      sorter: () => -1,
    },
    {
      title: 'Persona contrato',
      dataIndex: 'legalperson_name',
      key: 'legalperson_name',
      sorter: () => -1,
    },

    {
      title: 'Banco',
      dataIndex: 'legalperson_account_bco',
      key: 'legalpeson-account_bco',
      sorter: () => -1,
    },
    {
      title: 'Número de cuenta',
      dataIndex: 'legalperson_account_num',
      key: 'legalperson_account_num',
      width: 200,
      sorter: () => -1,
    },

    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 60,
      render: (text: string) => (
        <span>{text == '1' ? 'Activo' : 'Inactivo'}</span>
      ),
      sorter: () => -1,
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'editar',
      width: 15,
      sorter: () => -1,
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
  ] satisfies ColumnsType<ISucursal>
  return (
    <Table
      columns={columns}
      dataSource={sortedData}
      rowKey="id"
      size="small"
      style={{ marginTop: '-15px' }}
    />
  )
}
export default GetSucursal
