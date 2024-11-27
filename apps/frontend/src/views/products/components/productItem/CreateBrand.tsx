import { Button, Form, Input, Popover } from 'antd'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { IInvBrand } from '@/data/products/types'

export const CreateBrand: React.FC<{ onCreate: (id: number) => void }> = ({
  onCreate,
}) => {
  const [creating, setCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newBrand, setNewBrand] = useState<Partial<IInvBrand>>({
    status: 1,
  })

  const handleCreateBrand = async () => {
    try {
      setCreating(true)
      const { id } = await sdk.createBrand(newBrand)
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
              value={newBrand.brand}
              onChange={(e) =>
                setNewBrand({ ...newBrand, brand: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Button
                type="primary"
                loading={creating}
                onClick={handleCreateBrand}
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
