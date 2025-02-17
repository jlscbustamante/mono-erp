import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  menuReport,
  menuReportSt,
} from '@/data/maintenance/MenuReport/state/menuReport'
import { transformFilterToValid } from '@/data/maintenance/MenuReport/utils'
import { IFilterMenuReport, IReport } from '@/data/reports/types/report'
import { Filters } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/MenuReport/forms/Create'
import { RequestsFilters } from '../components/MenuReport/forms/FilterControl'
import { UpdateForm } from '../components/MenuReport/forms/Update'

export const GetMenuReport = () => {
  const [data, setData] = useState<IReport[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | IReport>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(menuReportSt)
  const setApprovedRequests = useSetRecoilState(menuReport)

  const applyFilters = async () => {
    try {
      const filters: Filters<IReport> = {}
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.filterReport({
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
      const filters: Filters<IReport> = {}
      setUserFilters({})
      const data = await sdk.filterReport({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<IReport> = {}
        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterReport({
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
    setIsDrawerVisible(false)
  }

  const handleEditClick = (record: IReport) => {
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
        title={`Nuevo reporte`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            menuReport={selectedRequest}
            setMenuReport={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar reporte`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            setMenuReport={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
            menuReport={selectedRequest}
          />
        )}
      </Drawer>
    </div>
  )
}
const RequirementsFound: React.FC<{
  requests: IReport[]
  setSelectedRequest: (request: IReport | null) => void
  handleEditClick: (record: IReport) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(menuReport)
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
      title: 'Nombre',
      dataIndex: 'rpt_name',
      key: 'rpt_name',
      sorter: (a, b) => a.rpt_name?.localeCompare(b.rpt_name ?? '') ?? -1,
    },
    {
      title: 'URL',
      dataIndex: 'rpt_url',
      key: 'rpt_url',
      sorter: () => -1,
    },
    {
      title: 'Token',
      dataIndex: 'rpt_token',
      key: 'rpt_token',
      sorter: () => -1,
    },
    {
      title: 'Key Report',
      dataIndex: 'key_report',
      key: 'key_report',
      sorter: () => -1,
    },
    {
      title: 'Key Workspace',
      dataIndex: 'key_workspc',
      key: 'key_workspc',
      sorter: () => -1,
    },
    {
      title: 'Mostrar',
      dataIndex: 'show_in',
      key: 'show_in',
      width: 200,
      sorter: () => -1,
      render: (text: number) => (
        <span>
          {text === 1
            ? 'Todos'
            : text === 2
              ? 'Solo Web'
              : text === 3
                ? 'Solo App'
                : ''}
        </span>
      ),
    },
    {
      title: 'Prioridad',
      dataIndex: 'priority',
      key: 'priority',
      width: 60,
      sorter: (a, b) => a.priority! - b.priority!,
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
  ] satisfies ColumnsType<IFilterMenuReport>

  return (
    <Table
      pagination={false}
      columns={columns}
      dataSource={sortedData}
      rowKey="id"
      size="small"
      style={{ marginTop: '-15px' }}
    />
  )
}
export default GetMenuReport
