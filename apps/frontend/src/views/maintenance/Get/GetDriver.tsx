import '@/views/maintenance/components/Driver/style.css'

import { Button, Drawer, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { IoStorefrontSharp } from 'react-icons/io5'
import { MdDelete, MdEdit } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { ExcelExportBtn } from '@/components/excel-btn'
import { NOTIFICATION } from '@/const/notification'
import {
  deleteCourrier,
  filterCourrier,
  generateExcel,
  getCourrier,
  updateStores,
} from '@/data/maintenance/Courrier/sdk'
import {
  filterCourrierSt,
  filterICourrier,
} from '@/data/maintenance/Courrier/state/courrier'
import { ICourrier } from '@/data/maintenance/Courrier/type/Courrier'
import { transformFilterToValidCourrier } from '@/data/maintenance/Courrier/utils'
import { Filters } from '@/data/types/Filters'

import { ColumnsType } from 'antd/es/table'
import { CreateForm } from '../components/Driver/CreateForm'
import { RequestsFilters } from '../components/Driver/FiltersControl'
import { UpdateForm } from '../components/Driver/UpdateForm'
import { UpdatePasswordForm } from '../components/Driver/UpdateFormPassword'
import { UpdateSucursalForm } from '../components/Driver/UpdateFormSucursal'
export const GetDriver = () => {
  const [, setTiendasActualizadas] = useState(false)
  const [data, setData] = useState<ICourrier[]>([])
  const [selectedRequest, setSelectedRequest] = useState<null | ICourrier>(null)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false)
  const [isUpdatePasswordFormVisible, setIsUpdatePasswordFormVisible] =
    useState(false)
  const [isUpdateSucursalFormVisible, setIsUpdateSucursalFormVisible] =
    useState(false)
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false)

  const setApprovedRequests = useSetRecoilState(filterICourrier)
  const [userFilters, setUserFilters] = useRecoilState(filterCourrierSt)

  const applyFilters = async () => {
    try {
      const filters: Filters<ICourrier> = {}
      const validFilterUsers = transformFilterToValidCourrier(userFilters)
      const tienda = validFilterUsers.stores
      delete validFilterUsers.stores
      const data: ICourrier[] = await filterCourrier({
        ...filters,
        ...validFilterUsers,
      })
      if (tienda) {
        const filteredData = data.filter((item) => item.stores === tienda[1])

        setApprovedRequests(filteredData)
      } else {
        setApprovedRequests(data)
      }
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const cleanFilters = async () => {
    try {
      const filters: Filters<ICourrier> = {}
      setUserFilters({})
      const data = await filterCourrier({ ...filters })
      setApprovedRequests(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getCourrier()
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

  const showDeleteConfirmationModal = (record: ICourrier) => {
    setSelectedRequest(record)
    setDeleteConfirmationVisible(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!selectedRequest) return

    try {
      await deleteCourrier(selectedRequest?.id)
      setDeleteConfirmationVisible(false)
      setSelectedRequest(null)
      toast.success('El repartidor fue eliminado', NOTIFICATION.success)
      cleanFilters()
    } catch (error) {
      toast.error(
        'Ocurrió un error al eliminar el repartidor',
        NOTIFICATION.error,
      )
    }
  }

  const handleExportClick = async () => {
    await generateExcel()
  }

  const handleActualizarTiendasClick = async () => {
    setTiendasActualizadas(true)
    toast.info('Actualizando tiendas...', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
    })

    try {
      await updateStores()
      toast.dismiss() // Ocultar el mensaje de "Actualizando tiendas"
      toast.success('Las tiendas fueron actualizadas', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
    } catch (error) {
      toast.dismiss() // Ocultar el mensaje de "Actualizando tiendas" en caso de error
      toast.error('Error al actualizar tiendas', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      })
    }
  }
  const handleDrawerCloseUpdate = () => {
    setSelectedRequest(null)
    setIsUpdateFormVisible(false)
  }

  const handleDrawerCloseUpdateSucursal = () => {
    setSelectedRequest(null)
    setIsUpdateSucursalFormVisible(false)
  }

  const handleDrawerCloseUpdatePassword = () => {
    setSelectedRequest(null)
    setIsUpdatePasswordFormVisible(false)
  }

  const handleEditClick = (record: ICourrier) => {
    setSelectedRequest(record)
    setIsUpdateFormVisible(true)
  }

  const handleEditSucursalClick = (record: ICourrier) => {
    setSelectedRequest(record)
    setIsUpdateSucursalFormVisible(true)
  }

  const handleEditPasswordClick = (record: ICourrier) => {
    setSelectedRequest(record)
    setIsUpdatePasswordFormVisible(true)
  }

  return (
    <div className="container mx-auto" style={{ marginTop: '-15px' }}>
      <div
        className="flex items-center gap-1.5 justify-between my-0"
        style={{ marginLeft: '15px', marginRight: '15px' }}
      >
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
        />
        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <Button type="primary" onClick={handleAddClick}>
            Nuevo
          </Button>
          <ExcelExportBtn onExport={handleExportClick} />
          <Button onClick={handleActualizarTiendasClick}>Sync Tiendas</Button>
        </div>
      </div>
      <RequirementsFound
        requests={data}
        setSelectedRequest={setSelectedRequest}
        handleEditClick={handleEditClick}
        handleEditSucursalClick={handleEditSucursalClick}
        handleEditPasswordClick={handleEditPasswordClick}
        showDeleteConfirmationModal={showDeleteConfirmationModal}
      />
      <Drawer
        title={`Nuevo repartidor`}
        open={isDrawerVisible}
        onClose={handleDrawerClose}
        width={440}
      >
        {isDrawerVisible && (
          <CreateForm
            courrier={selectedRequest}
            setCourrier={setSelectedRequest}
            onClose={handleDrawerClose}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar repartidor`}
        open={isUpdateFormVisible}
        onClose={handleDrawerCloseUpdate}
        width={440}
      >
        {isUpdateFormVisible && (
          <UpdateForm
            courrier={selectedRequest}
            setCourrier={setSelectedRequest}
            onClose={handleDrawerCloseUpdate}
            reload={cleanFilters}
          />
        )}
      </Drawer>
      <Drawer
        title={`Editar tienda`}
        open={isUpdateSucursalFormVisible}
        onClose={handleDrawerCloseUpdateSucursal}
        width={380}
      >
        {isUpdateSucursalFormVisible && (
          <UpdateSucursalForm
            driver={selectedRequest}
            setDriver={setSelectedRequest}
            onClose={handleDrawerCloseUpdateSucursal}
            reload={cleanFilters}
          />
        )}
      </Drawer>

      <Drawer
        title={`Reseteo contraseña`}
        open={isUpdatePasswordFormVisible}
        onClose={handleDrawerCloseUpdatePassword}
        width={410}
      >
        {isUpdatePasswordFormVisible && (
          <UpdatePasswordForm
            driver={selectedRequest}
            setDriver={setSelectedRequest}
            onClose={handleDrawerCloseUpdatePassword}
            reload={cleanFilters}
          />
        )}
      </Drawer>

      <Modal
        title="Confirmar eliminación"
        visible={deleteConfirmationVisible}
        onCancel={() => setDeleteConfirmationVisible(false)}
        footer={[
          <Button
            danger
            key="cancel"
            onClick={() => setDeleteConfirmationVisible(false)}
          >
            Cancelar
          </Button>,
          <Button key="delete" type="primary" onClick={handleDeleteConfirmed}>
            Eliminar
          </Button>,
        ]}
      >
        ¿Estás seguro de que deseas eliminar al repartidor?
      </Modal>
    </div>
  )
}

const RequirementsFound: React.FC<{
  requests: ICourrier[]
  setSelectedRequest: (request: ICourrier | null) => void
  handleEditClick: (record: ICourrier) => void
  handleEditSucursalClick: (record: ICourrier) => void
  handleEditPasswordClick: (record: ICourrier) => void
  showDeleteConfirmationModal: (record: ICourrier) => void
}> = ({
  handleEditClick,
  handleEditSucursalClick,
  handleEditPasswordClick,
  showDeleteConfirmationModal,
}) => {
  const data = useRecoilValue(filterICourrier)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 25,
      sorter: (a, b) => a.id! - b.id!,
    },
    {
      title: 'Nombres',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      sorter: (a, b) => a.name?.localeCompare(b.name ?? '') ?? -1,
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
      width: 120,
      sorter: (a, b) => a.email?.localeCompare(b.email ?? '') ?? -1,
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: ' Tipo Documento',
      dataIndex: 'doc_type',
      key: 'doc_type',
      width: 120,
    },
    {
      title: 'N° Documento',
      dataIndex: 'doc_number',
      key: 'doc_number',
      width: 110,
    },
    {
      title: 'Tienda',
      dataIndex: 'stores',
      key: 'stores',
      width: 120,
    },
    {
      title: 'Turno',
      dataIndex: 'shift_hired',
      key: 'shift_hired',
      width: 120,
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <IoStorefrontSharp
            style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => handleEditSucursalClick(record)}
            className="icon"
          />
          <RiLockPasswordLine
            style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }}
            onClick={() => handleEditPasswordClick(record)}
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
          <MdDelete
            style={{
              fontSize: '20px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
            className="icon"
            onClick={() => showDeleteConfirmationModal(record)}
          />
        </div>
      ),
    },
  ] satisfies ColumnsType<ICourrier>

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      size="small"
      style={{ marginTop: '-15px', marginLeft: '15px', marginRight: '15px' }}
    />
  )
}

export default GetDriver
