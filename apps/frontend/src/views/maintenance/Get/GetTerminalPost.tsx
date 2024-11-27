import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterITerminalPost,
  filterITerminalPostSt,
} from '@/data/maintenance/TerminalPost/state/terminalPost'
import { TerminalPostStatus } from '@/data/maintenance/TerminalPost/status/status'
import { ITerminalPost } from '@/data/maintenance/TerminalPost/type/TerminalPost'
import { transformFilterToValidTerminalPost } from '@/data/maintenance/TerminalPost/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { CreateForm } from '../components/TerminalPost/forms/Create'
import { RequestsFilters } from '../components/TerminalPost/forms/FilterControl'
import { UpdateForm } from '../components/TerminalPost/forms/Update'

export const GetTerminalPost = () => {
  const [data, setData] = useState<ITerminalPost[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ITerminalPost>(
    null,
  )
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterITerminalPostSt)
  const setApprovedRequests = useSetRecoilState(filterITerminalPost)

  const applyFilters = async () => {
    try {
      const filters: Filters<ITerminalPost> = {}
      const validFilterUsers = transformFilterToValidTerminalPost(userFilters)
      const data = await sdk.filterTerminalPost({
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
      const filters: Filters<ITerminalPost> = {}

      filters.status = [OpFilter.In, TerminalPostStatus.Active]

      setUserFilters({})
      const data = await sdk.filterTerminalPost({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ITerminalPost> = {}

        filters.status = [OpFilter.In, TerminalPostStatus.Active]

        const validFilterUsers = transformFilterToValidTerminalPost(userFilters)
        const data = await sdk.filterTerminalPost({
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
  const handleEditClick = (record: ITerminalPost) => {
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
        title={`Nuevo terminal`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        <CreateForm
          terminalPost={selectedRequest}
          setTerminalpost={setSelectedRequest}
          onClose={handleDrawerClose}
          reload={cleanFilters}
        />
      </Drawer>
      <Drawer
        title={`Editar terminal `}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            terminalPost={selectedRequest}
            setTerminalPost={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}
const RequirementsFound: React.FC<{
  requests: ITerminalPost[]
  setSelectedRequest: (request: ITerminalPost | null) => void
  handleEditClick: (record: ITerminalPost) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterITerminalPost)
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
      title: 'Terminal',
      dataIndex: 'terminal',
      key: 'terminal',
    },
    {
      title: 'Tienda',
      dataIndex: ['sucursal', 'title'],
      key: 'sucursal_id',
      width: 150,
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 200,
    },

    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
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
export default GetTerminalPost
