import '@/views/maintenance/components/Driver/style.css'
import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { getIIamRole } from '@/data/security/IamRole/sdk'
import { IIamRole } from '@/data/security/IamRole/type/IamRole'
import * as sdk from '@/data/security/IamUser/sdk'
import {
  filterIamUserSt,
  IamUserSt,
} from '@/data/security/IamUser/state/IamUser'
import { IIamUser } from '@/data/security/IamUser/type/IamUser'
import { Filters } from '@/data/types/Filters'

import { CreateForm } from '../components/IamUser/CreateForm'
import { RequestsFilters } from '../components/IamUser/FiltersControl'
import { ResetForm } from '../components/IamUser/ResetPassword'
import { UpdateForm } from '../components/IamUser/UpdateForm'

export const GetIamUser = () => {
  const [data, setData] = useState<IIamUser[]>([])
  const [roles, setRol] = useState<IIamRole[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | IIamUser>(null)

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(IamUserSt)

  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [ResetFormVisible, setResetFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterIamUserSt)

  const applyFilters = async () => {
    try {
      const data = await sdk.filterIamUser(userFilters)
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const cleanFilters = async () => {
    try {
      const filters: Filters<IIamUser> = {}

      setUserFilters({})
      const data = await sdk.filterIamUser({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const data = await sdk.filterIamUser(userFilters)
        const roles = await getIIamRole()
        setRol(roles)
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
  const handleDrawerCloseReset = () => {
    setSelectedRequest(null)
    setResetFormVisible(false)
  }

  const handleEditClick = (record: IIamUser) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }
  const handleResetPassword = (record: IIamUser) => {
    setSelectedRequest(record)
    setResetFormVisible(true)
  }
  return (
    <div className="container mx-auto" style={{ marginTop: '-15px' }}>
      <div className="flex items-center justify-between my-6 mt-1">
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
        handleEditClick={handleEditClick}
        roles={roles}
        handleResetPassword={handleResetPassword}
      />
      <Drawer
        title={`Nuevo usuario`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={450}
      >
        {isDrawerVisible && (
          <CreateForm
            iamUser={selectedRequest}
            setIamUser={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar usario`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={400}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            iamUser={selectedRequest}
            setIamUser={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>

      <Drawer
        title={`Resetear contraseña`}
        open={ResetFormVisible}
        onClose={handleDrawerCloseReset}
        width={400}
      >
        {ResetFormVisible && (
          <ResetForm
            iamUser={selectedRequest}
            setIamUser={setSelectedRequest}
            onClose={handleDrawerCloseReset}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  roles: IIamRole[]
  requests: IIamUser[]
  handleEditClick: (record: IIamUser) => void
  handleResetPassword: (record: IIamUser) => void
}> = ({ handleEditClick, roles, handleResetPassword }) => {
  const data = useRecoilValue(IamUserSt)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 500,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 400,
    },
    {
      title: 'Rol',
      dataIndex: 'rol_id',
      key: 'rol_id',
      width: 200,
      render: (text: number) => {
        const a = roles.find((a: { id: number }) => a.id === text)
        return <span>{a?.name}</span>
      },
    },
    {
      title: 'Estado',
      width: 10,
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => (
        <span>{text === 1 ? 'Activo' : 'Inactivo'}</span>
      ),
    },
    {
      title: '',
      width: 0,
      dataIndex: 'buttons',
      key: 'buttons',
      render: (_text: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RiLockPasswordLine
            style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => handleResetPassword(record)}
            className="icon"
          />
          <MdEdit
            onClick={() => handleEditClick(record)}
            style={{
              fontSize: '20px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            className="icon"
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        style={{ marginTop: '-40px' }}
      />
    </div>
  )
}

export default GetIamUser
