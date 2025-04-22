import { Input } from 'antd'
import { useState, useEffect } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
}

export const NameSearchInput = ({ value, onChange }: Props) => {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <Input
      placeholder="Buscar por nombre"
      allowClear
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => onChange(localValue)}
      onPressEnter={() => onChange(localValue)}
      style={{ width: 250 }}
    />
  )
}
