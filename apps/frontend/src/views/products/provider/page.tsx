import { Modal, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useMemo, useReducer, useState } from 'react'
import { FaTrash } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import { toast } from 'react-toastify'

import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'
import { deleteSupplier } from '@/data/products/sdk/maintenance'
import { IInvSupplier } from '@/data/products/types'

import { ControlProvider } from './ControlProvider'
import { CreateProviderDrawer } from './CreateProviderDrawer'
import { EditProviderDrawer, useProviderDrawer } from './EditProviderDrawer'
import { useSupplier } from './useSupplier'
import { useSupplierQuery } from './useSupplierQuery'

export default function Provider() {
  const [openModal, setOpenModal] = useState(false)
  const [controlerApply, applyFilters] = useReducer((state) => state + 1, 0)
  const { filterName, setFilterName, filters, setFilters } = useSupplier()

  const query = useSupplierQuery()

  const dataFiltered = useMemo(() => {
    let initialData = query.data ?? []
    if (filterName != '') {
      initialData = initialData.filter((item) => {
        return item.supplier.toLowerCase().includes(filterName.toLowerCase())
      })
    }

    if (filters.id) {
      const idEqual: number | undefined = (filters as any)?.id?.[1]
      if (idEqual) {
        initialData = initialData.filter((item) => item.id == idEqual)
      }
    }

    if (filters.legal_number) {
      const legalNumber: string | undefined = (filters as any)
        ?.legal_number?.[1]
      if (legalNumber) {
        initialData = initialData.filter((item) =>
          item.legalNumber?.toLowerCase().includes(legalNumber.toLowerCase()),
        )
      }
    }

    if (filters.status) {
      const status: number | undefined = (filters as any)?.status?.[1]
      if (status != undefined) {
        initialData = initialData.filter((item) => item.status == status)
      }
    }

    return initialData
  }, [query.data, controlerApply])

  return (
    <div className="p-3 flex flex-col gap-3">
      <ControlProvider
        openModal={() => setOpenModal(true)}
        filters={{ filterName, setFilterName }}
        reload={(clean) => {
          if (clean) {
            setFilterName('')
            setFilters({})
            applyFilters()
          }
          applyFilters()
        }}
      />
      <TableProvider
        suppliers={dataFiltered}
        loading={query.isLoading}
        onReload={() => query.refetch()}
      />
      <CreateProviderDrawer
        onCreate={() => query.refetch()}
        onClose={() => setOpenModal(false)}
        suppliers={query.data ?? []}
        open={openModal}
      />
      <EditProviderDrawer
        onUpdate={() => {
          query.refetch()
        }}
      />
    </div>
  )
}

const TableProvider = ({
  suppliers,
  loading,
  onReload,
}: {
  suppliers: IInvSupplier[]
  loading: boolean
  onReload: () => void
}) => {
  const { onOpen } = useProviderDrawer()
  const columnsTable: ColumnsType<IInvSupplier> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
    },
    {
      title: 'Razón Social',
      dataIndex: 'legalName',
      key: 'legal_name',
      sorter: (a, b) => a.legalName?.localeCompare(b.legalName),
      showSorterTooltip: false,
    },
    {
      title: 'RUC',
      dataIndex: 'legalNumber',
      key: 'ruc',
      sorter: (a, b) => a.legalNumber?.localeCompare(b.legalNumber),
    },
    {
      title: 'Nombre',
      dataIndex: 'supplier',
      key: 'name',
      sorter: (a, b) => a.supplier.localeCompare(b.supplier),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'state',
      render: (status: number) => {
        if (status == 1) {
          return <Tag color="green">Activo</Tag>
        } else if (status == 0) {
          return <Tag color="red">Inactivo</Tag>
        }
      },
    },
    {
      title: '',
      width: 50,
      render: (record: ISupplier) => {
        return (
          <div className="flex items-center justify-between gap-2">
            <div
              className="cursor-pointer"
              onClick={() => {
                onOpen(record)
              }}
            >
              <MdEdit className="h-auto w-5" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                Modal.confirm({
                  title: 'Eliminar',
                  content: '¿Está seguro de eliminar este proveedor?',
                  onOk: () => {
                    deleteSupplier(record.id)
                      .then((message) => {
                        toast.success(message.message)
                        onReload()
                      })
                      .catch((err) => {
                        toast.error(err)
                      })
                  },
                })
              }}
            >
              <FaTrash className="h-auto w-4" />
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <Table
      size="small"
      rowKey={'id'}
      columns={columnsTable}
      dataSource={suppliers}
      loading={loading}
      pagination={false}
    />
  )
}
