import { useMutation } from '@tanstack/react-query'
import { Modal } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { MdDelete, MdEdit } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'
import { toast } from 'react-toastify'

import { useParametersQuery } from '@/hooks/useParamters'

import { deleteCourier } from './api'
import { CreateDrawer } from './components/CreateDrawer'
import { UpdateDrawer, useEditDrawer } from './components/EditDrawer'
import {
  EditPasswordDrawer,
  useEditPasswordDrawer,
} from './components/EditPasswordDrawer'
import { EditStoreDrawer } from './components/EditStoreDrawer'
import { CourierControl } from './components/Filters'
import { TableCourier } from './components/TableCourier'
import { getDocTypeName, ICourier } from './types'
import { useCouriers } from './useCouriers'

export default function CourierPage() {
  const { data } = useParametersQuery()
  const query = useCouriers(data?.ciaIdMoturider ?? null)
  const { open: openEditPassword } = useEditPasswordDrawer()
  const { open: openEdit } = useEditDrawer()

  const mutation = useMutation({
    mutationFn: deleteCourier,
    onSuccess: () => {
      query.refetch()
      toast.success('Motorizado eliminado correctamente')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const columns: ColumnsType<ICourier> = [
    {
      title: 'Id',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'descend',
      showSorterTooltip: false,
    },
    {
      title: 'Nombres',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
    },
    // {
    //   title: 'Correo',
    //   dataIndex: 'email',
    //   showSorterTooltip: false,
    // },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
    },
    {
      title: 'Doc.',
      dataIndex: 'doc_type',
      render: (docType) => (docType ? getDocTypeName(docType) : ''),
    },
    {
      title: 'Num.',
      dataIndex: 'doc_number',
    },
    {
      title: 'Tienda',
      dataIndex: 'store_name',
    },
    // {
    //   title: 'Turno',
    //   dataIndex: 'shift_hired',
    //   render: (val) => getShiftName(val),
    // },
    {
      title: 'Estado',
      dataIndex: 'status',
      render: (val) => (val ? 'Activo' : 'Inactivo'),
    },
    {
      render: (record: ICourier) => {
        return (
          <div className="flex gap-1">
            {/* <IoStorefrontSharp
              className="text-slate-700 cursor-pointer h-auto w-5 hover:text-slate-800"
              onClick={() => openEditStore(record.id)}
            /> */}
            <RiLockPasswordLine
              className="text-slate-700 cursor-pointer h-auto w-5 hover:text-slate-800"
              onClick={() => openEditPassword(record.id)}
            />
            <MdEdit
              className="text-slate-700 cursor-pointer h-auto w-5 hover:text-slate-800"
              onClick={() => openEdit(record.id)}
            />
            <MdDelete
              className="text-slate-700 cursor-pointer h-auto w-5 hover:text-slate-800"
              onClick={() => {
                if (mutation.isPending) return
                return Modal.confirm({
                  title: `¿Estás seguro de eliminar al motorizado "${record.name}" ?`,
                  centered: true,
                  onOk: () => mutation.mutate(record.id),
                })
              }}
            />
          </div>
        )
      },
    },
  ]
  return (
    <div className="container mx-auto p-3">
      <CourierControl columns={columns} />
      <TableCourier columns={columns} />
      <CreateDrawer />
      <EditStoreDrawer />
      <EditPasswordDrawer />
      <UpdateDrawer />
    </div>
  )
}
