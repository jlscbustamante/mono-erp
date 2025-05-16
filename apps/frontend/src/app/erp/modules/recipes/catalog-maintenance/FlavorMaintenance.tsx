import { Button, Card, Divider, Space, Typography } from "antd"
import { useState } from "react"
import { NameSearchInput } from "./components/NameSearchInput"
import { AdvancedFilter, FilterField } from "./components/AdvancedFilter"
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import { FlavorTable } from "./components/FlavorTable"

const { Title } = Typography

const filterFields: FilterField[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'flavor', label: 'Nombre del sabor', type: 'string' },
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
  

export default function FlavorMaintenance() {
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
        <Title level={4} className="!mb-4">Mantenimiento de Sabores</Title>

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

        <FlavorTable nameFilter={nameSearch} filters={filtersApplied} />
      </Card>
    </div>
  )
}