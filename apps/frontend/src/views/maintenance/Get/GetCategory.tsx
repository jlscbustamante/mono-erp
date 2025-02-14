import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  filterCategorySt,
  filterIFilterCategory,
} from '@/data/category/state/category'
import { ICategory, IFilterCategory } from '@/data/category/types'
import { transformFilterToValidCategory } from '@/data/category/utils'
import { Filters } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/Category/forms/Create'
import { RequestsFilters } from '../components/Category/forms/FilterControl'
import { UpdateForm } from '../components/Category/forms/UpdateForm'
export const GetCategory = () => {
  const [data, setData] = useState<ICategory[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ICategory>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const setApprovedRequests = useSetRecoilState(filterIFilterCategory)
  const [userFilters, setUserFilters] = useRecoilState(filterCategorySt)
  const applyFilters = async () => {
    try {
      const filters: Filters<ICategory> = {}
      const validFilterUsers = transformFilterToValidCategory(userFilters)
      const data = await sdk.filterCategory({
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
      const filters: Filters<ICategory> = {}

      //filters.status = [OpFilter.In, CategoryStatus.Active]

      setUserFilters({})
      const data = await sdk.filterCategory({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const filters: Filters<ICategory> = {}

        //filters.status = [OpFilter.In, CategoryStatus.Active]

        const validFilterUsers = transformFilterToValidCategory(userFilters)
        const data = await sdk.filterCategory({
          ...filters,
          ...validFilterUsers,
        })
        setApprovedRequests(data)
        setData(data)
      } catch (error: any) {
        toast.error(error.message, NOTIFICATION.error)
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
  const handleEditClick = (record: ICategory) => {
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
        title={`Nueva categoria`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            category={selectedRequest}
            setCategory={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar categoria`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            category={selectedRequest}
            setCategory={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ICategory[]
  setSelectedRequest: (request: ICategory | null) => void
  handleEditClick: (record: ICategory) => void
}> = ({ handleEditClick }) => {
  const data = useRecoilValue(filterIFilterCategory)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 25,
      sorter: (a, b) => a.id! - b.id!,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 380,
      sorter: (a, b) => a.name?.localeCompare(b.name ?? '') ?? -1,
    },
    {
      title: 'Cuenta',
      dataIndex: ['account', 'account'],
      key: 'account_id',
      width: 120,
      sorter: (a: any, b: any) =>
        (a.account?.account as string)?.localeCompare(
          b.account?.account ?? '',
        ) ?? -1,
    },
    {
      dataIndex: 'account_id',
      key: 'account_id',
      sorter: (a: any, b: any) => (a.account_id ?? 0) - (b.account_id ?? 0),
    },
    {
      title: 'Tipo de categoria',
      dataIndex: ['categoryType', 'name'],
      key: 'type_category_id',
      width: 120,
      sorter: (a: any, b: any) =>
        (a.categeoryType?.name as string)?.localeCompare(
          b.categeoryType?.name ?? '',
        ) ?? -1,
    },
    {
      title: 'Flujo contable',
      dataIndex: 'account_flow',
      key: 'account_flow',
      width: 110,
      render: (text: string) => {
        let label = ''

        switch (text) {
          case 'I':
            label = 'I / Ingreso'
            break
          case 'S':
            label = 'S / Salida'
            break
          default:
            label = ''
            break
        }

        return <span>{label}</span>
      },
    },
    {
      title: 'Tipo de movimiento',
      dataIndex: 'type_mov',
      key: 'type_mov',
      width: 120,
      render: (text: string) => {
        let label = ''

        switch (text) {
          case 'V':
            label = 'V / Venta'
            break
          case 'G':
            label = 'G / Gasto'
            break
          default:
            label = ''
            break
        }

        return <span>{label}</span>
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      width: 40,
      render: (text: string) => (
        <span>{text == 'A' ? 'Activo' : 'Inactivo'}</span>
      ),
      sorter: (a, b) => a.status?.localeCompare(b.status ?? '') ?? -1,
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
  ] satisfies ColumnsType<IFilterCategory>
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
export default GetCategory
