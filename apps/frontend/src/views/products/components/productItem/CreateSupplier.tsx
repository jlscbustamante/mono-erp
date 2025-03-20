import { Button, Form, Input, Popover } from 'antd'
import { useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { IInvSupplier } from '@/data/products/types'
import * as sdkRequest from '@/data/requests/sdk'
import { SupplierSelect } from '@pizzadb'

const { Search } = Input
export const CreateSupplier: React.FC<{
  suppliers?: SupplierSelect[]
  onCreate: (id: number, name?: string, ruc?: string) => void
}> = ({ onCreate, suppliers }) => {
  const [loadingRuc, setLoadingRuc] = useState(false)
  const [creating, setCreating] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState<Partial<IInvSupplier>>({
    status: 1,
  })

  const handleSearchRuc = async (ruc: string) => {
    try {
      setLoadingRuc(true)
      const { name } = await sdkRequest.getNameByRuc(ruc)
      setNewSupplier({ ...newSupplier, legalName: name })
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setLoadingRuc(false)
    }
  }

  const handleCreateSupplier = async () => {
    try {
      setCreating(true)
      // const { id } = await sdk.createSupplier(newSupplier)
      // onCreate(id, newSupplier.legalName, newSupplier.legalNumber)
      // setNewSupplier({ status: 1 })
      // setIsOpen(false)
      console.log('creado')
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
          <Form.Item
            label="Ruc"
            rules={[
              () => ({
                validator(_, value, callback) {
                  const isUnique = suppliers?.some(
                    (el: any) =>
                      el.legalNumber?.toString().toLowerCase() ===
                      value.toString().toLowerCase(),
                  )
                  if (suppliers && isUnique) {
                    callback('El ruc ya existe')
                  } else callback()
                },
              }),
            ]}
          >
            {/* <Input
              value={newSupplier.legalNumber}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, legalNumber: e.target.value })
              }
            /> */}
            <Search
              placeholder="000000000000"
              value={newSupplier.legalNumber ?? ''}
              onChange={(e) => {
                setNewSupplier({ ...newSupplier, legalNumber: e.target.value })
              }}
              onSearch={(ruc) => {
                handleSearchRuc(ruc)
              }}
              loading={loadingRuc}
            />
          </Form.Item>
          <Form.Item label="R. social">
            <Input
              value={newSupplier.legalName}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, legalName: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Nombre">
            <Input
              value={newSupplier.supplier}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, supplier: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end">
              <Button
                type="primary"
                loading={creating}
                onClick={handleCreateSupplier}
                disabled={!newSupplier.legalNumber || !newSupplier.supplier}
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
