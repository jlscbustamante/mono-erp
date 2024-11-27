import { Button, Form, Input, Popover } from 'antd'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { IInvCategory } from '@/data/products/types'

export const CreateCategory: React.FC<{ onCreate: (id: number) => void }> = ({
  onCreate,
}) => {
  const [creating, setCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newCategory, setNewCategory] = useState<Partial<IInvCategory>>({
    status: 1,
  })

  const handleCreateCategory = async () => {
    try {
      setCreating(true)
      const { id } = await sdk.createInvCategory(newCategory)
      onCreate(id)
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
              value={newCategory.category}
              onChange={(e) =>
                setNewCategory({ ...newCategory, category: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Button
                type="primary"
                loading={creating}
                onClick={handleCreateCategory}
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
