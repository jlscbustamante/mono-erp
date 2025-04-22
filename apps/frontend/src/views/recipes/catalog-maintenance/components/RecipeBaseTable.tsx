import { Table, Tag, Button, Space, Tooltip } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { IRecipeBase } from '../../shared/types'

import { EditRecipeBaseDrawer } from './EditRecipeBaseDrawer'
import { getRecipeBasesFromDB } from '../services/catalogMaintenanceApi'
import { useDeleteRecipeBase } from '../hooks/useDeleteRecipeBase'
import { useEditRecipeBase } from '../hooks/useEditRecipeBase'

interface Props {
  nameFilter: string
  filters: Record<string, any>
}

export const RecipeBaseTable = ({ nameFilter, filters }: Props) => {
  const { data = [], isLoading } = useQuery<IRecipeBase[]>({
    queryKey: ['recipe-base-maintenance'],
    queryFn: getRecipeBasesFromDB,
  })

  const { deleteRecipeBase, isLoading: isDeleteLoading } = useDeleteRecipeBase()
  const { mutate: updateRecipeBase, isPending: isSaving } = useEditRecipeBase()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipeBase | null>(null)

  const handleEdit = (recipe: IRecipeBase) => {
    setSelectedRecipe(recipe)
    setDrawerOpen(true)
  }

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = item.title.toLowerCase().includes(nameFilter.toLowerCase())

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === '') return true
        const fieldValue = item[key as keyof IRecipeBase]
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
      dataIndex: 'title',
    },
    {
      title: 'Tamaño ID',
      dataIndex: 'product_size_id',
      width: 120
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 100,
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Activo</Tag>
        ) : (
          <Tag color="red">Inactivo</Tag>
        ),
    },
    {
      title: 'Acciones',
      width: 100,
      render: (_: any, record: IRecipeBase) => (
        <Space>
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} type="text" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<DeleteOutlined />}
              danger
              type="text"
              onClick={() => deleteRecipeBase(record.id, record.title)}
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
      <EditRecipeBaseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        recipe={selectedRecipe}
        onSubmit={(updated) => updateRecipeBase(updated)}
        loading={isSaving}
      />
    </div>
  )
}
