import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterCostCenterSt,
  filtersCostCenter,
} from '@/data/costCenter/state/filters'
import { CostCenterStatus } from '@/data/maintenance/CostCenter/status/status'
import { ICostCenter } from '@/data/maintenance/CostCenter/type/CostCenter'
import { transformFilterToValidCostCenter } from '@/data/maintenance/CostCenter/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { IFilterCostCenter } from '@/data/costCenter/types'
import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/CostCenter/forms/Create'
import { RequestsFilters } from '../components/CostCenter/forms/FilterControl'
import { UpdateForm } from '../components/CostCenter/forms/Update'
export const GetCostCenter = () => {
  const [data, setData] = useState<ICostCenter[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ICostCenter>(
    null,
  )
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterCostCenterSt)
  const setApprovedRequests = useSetRecoilState(filtersCostCenter)
  const applyFilters = async () => {
    try {
      const filters: Filters<ICostCenter> = {}
      const validFilterUsers = transformFilterToValidCostCenter(userFilters)
      const data = await sdk.filterCostCenter({
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
      const filters: Filters<ICostCenter> = {}

      filters.status = [OpFilter.In, CostCenterStatus.Active]

      setUserFilters({})
      const data = await sdk.filterCostCenter({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ICostCenter> = {}

        filters.status = [OpFilter.In, CostCenterStatus.Active]

        const validFilterUsers = transformFilterToValidCostCenter(userFilters)
        const data = await sdk.filterCostCenter({
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
  const handleEditClick = (record: ICostCenter) => {
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
        title={`Nuevo centro de costos`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            costCenter={selectedRequest}
            setCostCenter={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar centro de costos`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
            costCenter={selectedRequest}
            setCostCenter={setSelectedRequest}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ICostCenter[]
  setSelectedRequest: (request: ICostCenter | null) => void
  handleEditClick: (record: ICostCenter) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filtersCostCenter)
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
      title: 'Centro de costo',
      dataIndex: 'origin',
      key: 'origin',
      width: 400,
      sorter: (a, b) => a.origin?.localeCompare(b.origin ?? '') ?? -1,
    },
    {
      title: 'Cuenta de tienda',
      dataIndex: ['account', 'account'],
      key: 'account_caja',
      width: 180,
    },
    {
      title: 'Cuenta de ajuste',
      dataIndex: ['account_ajustes', 'account'],
      key: 'account_ajuste',
      width: 180,
    },
    {
      title: 'Cuenta de mercaderia',
      dataIndex: ['account_mercas', 'account'],
      key: 'account_merca',
      width: 180,
    },
    {
      title: '¿Es tienda?',
      dataIndex: 'is_cash',
      key: 'is_cash',
      width: 80,
      render: (text: string) => <span>{text == '1' ? 'Sí' : 'No'}</span>,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text: string) => (
        <span>{text == '1' ? 'Activo' : 'Inactivo'}</span>
      ),
      sorter: (a, b) =>
        a.status?.toString().localeCompare(b.status?.toString() ?? '') ?? -1,
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
  ] satisfies ColumnsType<IFilterCostCenter>
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
export default GetCostCenter
