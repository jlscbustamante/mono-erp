import { Button, Form, Input, Popover } from 'antd'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { IInvMeasure } from '@/data/products/types'

export const CreateMeasure: React.FC<{
  onChange: (insertId: number) => void
}> = ({ onChange }) => {
  const [creating, setCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newMeasure, setNewMeasure] = useState<Partial<IInvMeasure>>({
    measure: '',
    code: '',
    status: 1,
  })
  const handleCreateMeasure = async () => {
    try {
      setCreating(true)
      const { id } = await sdk.createInvMeasure(newMeasure)
      onChange(id)
      setIsOpen(false)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setCreating(false)
    }
  }
  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      trigger={'click'}
      arrow={false}
      content={
        <Form>
          <Form.Item label="Nombre">
            <Input
              value={newMeasure.measure}
              onChange={(e) =>
                setNewMeasure({ ...newMeasure, measure: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Codigo">
            <Input
              placeholder="KG"
              maxLength={5}
              value={newMeasure.code}
              onChange={(e) => {
                setNewMeasure({ ...newMeasure, code: e.target.value })
              }}
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Button
                type="primary"
                loading={creating}
                onClick={handleCreateMeasure}
              >
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
