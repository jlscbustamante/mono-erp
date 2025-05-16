import { Table, Tag, Button, Space, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { IProductFlavor } from '../../shared/types'
import { useMemo, useState } from 'react'
import { EditFlavorDrawer } from './EditFlavorDrawer'
import { getFlavorsFromDB } from '../services/catalogMaintenanceApi'
import { useDeleteFlavor } from '../hooks/useDeleteFlavor'
import { useEditFlavor } from '../hooks/useEditFlavor'

interface Props {
  nameFilter: string
  filters: Record<string, any>
}

export const FlavorTable = ({ nameFilter, filters }: Props) => {
  const { data = [], isLoading } = useQuery<IProductFlavor[]>({
    queryKey: ['flavor-maintenance'],
    queryFn: getFlavorsFromDB,
  })

  const { deleteFlavor, isLoading: isDeleteLoading } = useDeleteFlavor()
  const { mutate: updateFlavor, isPending: isSaving } = useEditFlavor()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedFlavor, setSelectedFlavor] = useState<IProductFlavor | null>(null)

  const handleEdit = (flavor: IProductFlavor) => {
    setSelectedFlavor(flavor)
    setDrawerOpen(true)
  }

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = item.flavor.toLowerCase().includes(nameFilter.toLowerCase())

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === '') return true
        const fieldValue = item[key as keyof IProductFlavor]
        return fieldValue?.toString().toLowerCase().includes(value.toString().toLowerCase())
      })

      return matchesName && matchesFilters
    })
  }, [data, nameFilter, filters])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Nombre',
      dataIndex: 'flavor',
    },
    {
      title: 'MenuFlavor ID',
      dataIndex: 'menuflav_id',
      width: 120
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 100,
      render: (status: number) =>
        status === 1 ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>,
    },
    {
      title: 'Acciones',
      width: 100,
      render: (_: any, record: IProductFlavor) => (
        <Space>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} type="text" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => deleteFlavor(record.id!, record.flavor)}
              loading={isDeleteLoading}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        size="middle"
        sticky
      />
      <EditFlavorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        flavor={selectedFlavor}
        onSubmit={(updated) => updateFlavor(updated)}
        loading={isSaving}
      />
    </div>
  )
}
