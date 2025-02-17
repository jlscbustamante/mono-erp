import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterITypeFilterCategory,
  filterTypeCategorySt,
} from '@/data/category/state/category'
import {
  CategoryStatus,
  IFilterTypeCategory,
  ITypeCategory,
} from '@/data/category/types'
import { transformFilterToValid } from '@/data/category/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/CategoryTye/forms/Create'
import { RequestsFilters } from '../components/CategoryTye/forms/FilterControl'
import { UpdateForm } from '../components/CategoryTye/forms/Update'
export const GetTypeCategory = () => {
  const [selectedRequest, setSelectedRequest] = useState<null | ITypeCategory>(
    null,
  )
  const [data, setData] = useState<ITypeCategory[]>([])
  const setApprovedRequests = useSetRecoilState(filterITypeFilterCategory)
  const [userFilters, setUserFilters] = useRecoilState(filterTypeCategorySt)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)

  const applyFilters = async () => {
    try {
      const filters: Filters<IFilterTypeCategory> = {}
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.filterTypeCategory({
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
      const filters: Filters<IFilterTypeCategory> = {}

      filters.status = [OpFilter.In, CategoryStatus.Active]

      setUserFilters({})
      const data = await sdk.filterTypeCategory({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<IFilterTypeCategory> = {}

        filters.status = [OpFilter.In, CategoryStatus.Active]

        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterTypeCategory({
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
  const handleDrawerCloseUpdate = () => {
    setSelectedRequest(null)
    setIsUpdateFormVisible(false)
  }
  const handleEditClick = (record: ITypeCategory) => {
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
        title={`Nuevo tipo de categoria`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            typeCategory={selectedRequest}
            setTypeCategory={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar tipo de categoria`}
        open={isUpdateFormVisible}
        onClose={() => setIsUpdateFormVisible(false)}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            onClose={handleDrawerCloseUpdate}
            typeCategory={selectedRequest}
            setTypeCategory={setSelectedRequest}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ITypeCategory[]
  setSelectedRequest: (request: ITypeCategory | null) => void
  handleEditClick: (record: ITypeCategory) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterITypeFilterCategory)
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
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name?.localeCompare(b.name ?? '') ?? -1,
    },
    {
      title: 'Tipo ID',
      dataIndex: 'type_id',
      key: 'type_id',
      width: 150,
      sorter: () => -1,
      render: (text: string, record: IFilterTypeCategory) => {
        const label = `${record.name} / ${text}`
        return <span>{label}</span>
      },
    },

    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      sorter: () => -1,
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
  ] satisfies ColumnsType<ITypeCategory>

  return (
    <div>
      <Table
        pagination={false}
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        style={{ marginTop: '-15px' }}
      />
    </div>
  )
}

export default GetTypeCategory
