import { Button, Form, Input, Popover, Select } from 'antd'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'

import { IInvWarehouse } from '@/data/products/types'
import { filterSelectForm } from '@/utils'

import { useDispatch } from '../../state/useDispatch'

export const CreateWareHouseModal: React.FC<{
  sucursales: { label: string; value: string }[]
}> = ({ sucursales }) => {
  const [loading, setLoading] = useState(false)
  const { createWarehouse } = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [newWarehouse, setNewWarehouse] = useState<Partial<IInvWarehouse>>({
    status: 1,
  })

  const onCreate = async () => {
    setLoading(true)
    await createWarehouse(newWarehouse)
    setLoading(false)
    setNewWarehouse({ status: 1 })
    setIsOpen(false)
  }
  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Crear Almacén"
      trigger={'click'}
      content={
        <Form>
          <Form.Item label="Nombre">
            <Input
              value={newWarehouse.name ?? ''}
              onChange={(e) => {
                setNewWarehouse({ ...newWarehouse, name: e.target.value })
              }}
            />
          </Form.Item>
          <Form.Item label="Sucursal">
            <Select
              showSearch={true}
              filterOption={filterSelectForm}
              value={newWarehouse.sucursalId}
              onChange={(value) => {
                setNewWarehouse({ ...newWarehouse, sucursalId: value })
              }}
            >
              {sucursales.map((suc) => (
                <Select.Option key={suc.value} value={suc.value}>
                  {suc.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Button type="primary" onClick={onCreate} loading={loading}>
                Crear
              </Button>
            </div>
          </Form.Item>
        </Form>
      }
    >
      <Button className="w-7 p-0">
        <LuPlus />
      </Button>
    </Popover>
  )
}
