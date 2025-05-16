import { useState } from 'react'
import { Card, Typography, Divider, Button, Space } from 'antd'
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { AdvancedFilter, FilterField } from './components/AdvancedFilter'
import { NameSearchInput } from './components/NameSearchInput'
import { RecipeBaseTable } from './components/RecipeBaseTable'

const { Title } = Typography

const filterFields: FilterField[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'flavor', label: 'Nombre del sabor', type: 'string' },
  { key: 'menuflav_id', label: 'MenuFlavor ID', type: 'number' },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { value: 1, label: 'Activo' },
      { value: 0, label: 'Inactivo' }
    ]
  }
]

export default function RecipeBaseMaintenance() {
  const [localName, setLocalName] = useState('')
  const [filtersDraft, setFiltersDraft] = useState<Record<string, any>>({})
  const [nameSearch, setNameSearch] = useState('')
  const [filtersApplied, setFiltersApplied] = useState<Record<string, any>>({})

  const handleDynamicFilterChange = (field: string, value: any) => {
    setFiltersDraft((prev) => ({ ...prev, [field]: value }))
  }

  const clearAllFilters = () => {
    setFiltersDraft({})
    setLocalName('')
    setNameSearch('')
    setFiltersApplied({})
  }

  const applyFilters = () => {
    setFiltersApplied(filtersDraft)
    setNameSearch(localName.trim())
  }

  return (
    <div className="space-y-6">
      <Card>
        <Title level={4} className="!mb-4">Mantenimiento de Recetas Base</Title>

        <Space wrap style={{ marginBottom: 16 }}>
          <NameSearchInput value={localName} onChange={setLocalName} />
          <AdvancedFilter filters={filtersDraft} onChange={handleDynamicFilterChange} fields={filterFields} />
          <Button icon={<SearchOutlined />} type="primary" onClick={applyFilters}>
            Buscar
          </Button>
          <Button icon={<DeleteOutlined />} danger onClick={clearAllFilters}>
            Limpiar
          </Button>
        </Space>

        <Divider />

        <RecipeBaseTable nameFilter={nameSearch} filters={filtersApplied} />
      </Card>
    </div>
  )
}