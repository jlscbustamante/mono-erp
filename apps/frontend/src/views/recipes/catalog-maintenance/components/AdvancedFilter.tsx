import { Button, Dropdown, InputNumber, Input, Select, Space, Tag } from 'antd'
import { FilterOutlined, CloseOutlined } from '@ant-design/icons'
import { useDeferredValue, useState } from 'react'

const { Option } = Select

export interface FilterField {
  key: string
  label: string
  type: 'number' | 'string' | 'select'
  options?: { value: any; label: string }[]
}

interface Props {
  filters: Record<string, any>
  onChange: (field: string, value: any) => void
  fields: FilterField[]
}

export const AdvancedFilter = ({ filters, onChange, fields }: Props) => {
  const [activeFields, setActiveFields] = useState<string[]>([])
  const [localValues, setLocalValues] = useState<Record<string, any>>({})

  const addField = (key: string) => {
    if (!activeFields.includes(key)) {
      setActiveFields([...activeFields, key])
      setLocalValues((prev) => ({ ...prev, [key]: filters[key] ?? '' }))
    }
  }

  const removeField = (key: string) => {
    setActiveFields(activeFields.filter(f => f !== key))
    const updatedLocal = { ...localValues }
    delete updatedLocal[key]
    setLocalValues(updatedLocal)
    onChange(key, undefined)
  }

  const updateLocalValue = (key: string, value: any) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }))
  }

  const confirmFilter = (key: string) => {
    onChange(key, localValues[key])
  }

  return (
    <Space wrap>
      <Dropdown
        menu={{
          items: fields.map(f => ({ key: f.key, label: f.label })),
          onClick: ({ key }) => addField(key),
        }}
        trigger={['click']}
      >
        <Button icon={<FilterOutlined />}>Agregar filtro</Button>
      </Dropdown>

      {activeFields.map(fieldKey => {
        const field = fields.find(f => f.key === fieldKey)
        const localValue = localValues[fieldKey]

        if (!field) return null

        return (
          <Space
            key={fieldKey}
            style={{
              border: '1px solid #d9d9d9',
              padding: 6,
              borderRadius: 6,
              background: '#fafafa'
            }}
          >
            <Tag
              closable
              onClose={() => removeField(fieldKey)}
              style={{ marginRight: 4 }}
            >
              {field.label}
            </Tag>

            {field.type === 'number' && (
              <InputNumber
                value={localValue}
                placeholder={field.label}
                onChange={(v) => updateLocalValue(fieldKey, v)}
                onBlur={() => confirmFilter(fieldKey)}
              />
            )}

            {field.type === 'string' && (
              <Input
                value={localValue}
                placeholder={field.label}
                onChange={(e) => updateLocalValue(fieldKey, e.target.value)}
                onBlur={() => confirmFilter(fieldKey)}
                onPressEnter={() => confirmFilter(fieldKey)}
              />
            )}

            {field.type === 'select' && (
              <Select
                value={localValue}
                placeholder={field.label}
                onChange={(v) => {
                  updateLocalValue(fieldKey, v)
                  confirmFilter(fieldKey)
                }}
                style={{ width: 120 }}
              >
                {field.options?.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            )}
          </Space>
        )
      })}
    </Space>
  )
}