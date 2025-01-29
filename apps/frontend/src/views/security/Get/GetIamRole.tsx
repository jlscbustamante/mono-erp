import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/security/IamRole/sdk'
import {
  filterIamRoleSt,
  IamRoleSt,
} from '@/data/security/IamRole/state/IamRole'
import { IIamRole } from '@/data/security/IamRole/type/IamRole'
import { Filters } from '@/data/types/Filters'

import { CreateForm } from '../components/IamRole/CreateForm'
import { RequestsFilters } from '../components/IamRole/FiltersControl'
import { UpdateRolForm } from '../components/IamRole/UpdateRolForm'

export const GetIamRole = () => {
  const [data, setData] = useState<IIamRole[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | IIamRole>(null)

  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(IamRoleSt)

  const [, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setRoleFilters] = useRecoilState(filterIamRoleSt)
  const [isUpdateRolFormVisible, setIsUpdateRolFormVisible] = useState(false)

  const applyFilters = async () => {
    try {
      const data = await sdk.filterIamRole(userFilters)
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  const cleanFilters = async () => {
    try {
      const filters: Filters<IIamRole> = {}

      setRoleFilters({})
      const data = await sdk.filterIamRole({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const data = await sdk.filterIamRole(userFilters)
        setApprovedRequests(data)
        setData(data)
      } catch (error: any) {
        console.error('Error al obtener los datos de los Roles:', error)
      }
    })()
  }, [])

  const handleAddClick = () => {
    setIsDrawerVisible(true)
  }
  const handlePermissionClick = (record: IIamRole) => {
    setSelectedRequest(record)
    setIsUpdateRolFormVisible(true)
  }

  const handleDrawerClose = () => {
    setSelectedRequest(null)
    setIsDrawerVisible(false)
  }

  const handleDrawerCloseUpdateRol = () => {
    setSelectedRequest(null)
    setIsUpdateRolFormVisible(false)
  }

  const handleEditClick = (record: IIamRole) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }

  return (
    <div className="container mx-auto" style={{ marginTop: '-15px' }}>
      <div className="flex items-center gap-1.5 justify-between my-6 mt-1">
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
        handlePermissionClick={handlePermissionClick}
      />
      <Drawer
        title={`Nuevo rol`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
          // iamRole={selectedRequest}
          // setIamRole={setSelectedRequest}
          // onClose={handleDrawerClose}
          // reload={cleanFilters}
          />
        )}
      </Drawer>

      <Drawer
        title="Editar permisos"
        open={isUpdateRolFormVisible}
        onClose={handleDrawerCloseUpdateRol}
        width={440}
      >
        {isUpdateRolFormVisible && (
          <UpdateRolForm
            onClose={handleDrawerCloseUpdateRol}
            setIamRole={setSelectedRequest}
            iamRole={selectedRequest}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: IIamRole[]
  setSelectedRequest: (request: IIamRole | null) => void
  handleEditClick: (record: IIamRole) => void
  handlePermissionClick: (record: IIamRole) => void
}> = ({ handlePermissionClick }) => {
  const data = useRecoilValue(IamRoleSt)
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
      title: 'Estado',
      width: 200,
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => (
        <span>{text === 1 ? 'Activo' : 'Inactivo'}</span>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'editar',
      width: 15,
      render: (_text: any, record: any) => (
        <MdEdit
          style={{
            fontSize: '20px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
          className="icon"
          onClick={() => handlePermissionClick(record)}
        />
      ),
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        size="small"
        style={{ marginTop: '-40px' }}
      />
    </div>
  )
}

export default GetIamRole
