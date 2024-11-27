import '@/views/maintenance/components/Driver/style.css'
import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterISupplier,
  filterSupplierSt,
} from '@/data/maintenance/Supplier/state/supplier'
import { SupplierStatus } from '@/data/maintenance/Supplier/status/status'
import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'
import { transformFilterToValid } from '@/data/maintenance/Supplier/utils'
import { Filters, OpFilter } from '@/data/types/Filters'

import { CreateForm } from '../components/Supplier/forms/Create'
import { RequestsFilters } from '../components/Supplier/forms/FilterControl'
import { UpdateForm } from '../components/Supplier/forms/Update'
export const GetSupplier: React.FC<{ small?: boolean }> = ({ small }) => {
  const [data, setData] = useState<ISupplier[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ISupplier>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [userFilters, setUserFilters] = useRecoilState(filterSupplierSt)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(filterISupplier)

  const applyFilters = async () => {
    try {
      const filters: Filters<ISupplier> = {}
      const validFilterUsers = transformFilterToValid(userFilters)
      const data = await sdk.filterSupplier({
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
      const filters: Filters<ISupplier> = {}

      filters.status = [OpFilter.In, SupplierStatus.Active]

      setUserFilters({})
      const data = await sdk.filterSupplier({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ISupplier> = {}

        filters.status = [OpFilter.In, SupplierStatus.Active]

        const validFilterUsers = transformFilterToValid(userFilters)
        const data = await sdk.filterSupplier({
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
  const handleEditClick = (record: ISupplier) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }
  return (
    <div className={`mx-auto px-4 ${small ? '' : 'container mt-10'}`}>
      <div
        className={`flex items-center gap-1.5 justify-between ${
          small ? 'py-3' : ' mt-1 mb-6 '
        }`}
      >
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
          small={true}
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
        title={`Nuevo proveedor`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            supplier={selectedRequest}
            setSupplier={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar proveedor`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            supplier={selectedRequest}
            setSupplier={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}
const RequirementsFound: React.FC<{
  requests: ISupplier[]
  setSelectedRequest: (request: ISupplier | null) => void
  handleEditClick: (record: ISupplier) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterISupplier)
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
      title: 'Proveedor',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Nombre',
      dataIndex: 'legal_name',
      key: 'legal_name',
    },
    {
      title: 'RUC',
      dataIndex: 'legal_number',
      key: 'legal_number',
    },
    {
      title: 'Banco',
      dataIndex: 'legal_account_bco',
      key: 'legal_account_bco',
    },
    {
      title: 'Número de cuenta',
      dataIndex: 'legal_account_num',
      key: 'legal_account_num',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 40,
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
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        size="small"
        style={{ marginTop: '-15px' }}
      />
    </div>
  )
}

export default GetSupplier
