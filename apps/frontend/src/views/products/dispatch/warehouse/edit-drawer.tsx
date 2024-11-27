import {
  updateLegalWarehouse,
  updateSucursalFromPos,
} from '@/data/hex/inventory'
import { WAREHOUSE_TYPE, WarehouseLegal } from '@/data/hex/types'
import { useLegalWarehouses } from '@/hooks/data/iventory/use-legal-warehouses'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

const editWarehouseAtom = atom<WarehouseLegal | null>({
  key: 'editWarehouseAtom',
  default: null,
})

export const useEditWarehouse = () => {
  const [editWarehouse, setEditWarehouse] = useRecoilState(editWarehouseAtom)

  const open = (warehouse: WarehouseLegal) => {
    setEditWarehouse(warehouse)
  }
  const close = () => {
    setEditWarehouse(null)
  }

  return {
    isOpen: !!editWarehouse,
    open,
    close,
    warehouse: editWarehouse,
  }
}

export const EditDrawer = () => {
  const { isOpen, close, warehouse } = useEditWarehouse()
  const { refetch } = useLegalWarehouses()

  const updateFromPos = useMutation({
    mutationFn: updateSucursalFromPos,
    onSuccess: () => {
      refetch()
      close()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })
  return (
    <Drawer
      title={
        !warehouse ? (
          'Editar almacen'
        ) : (
          <div className="flex items-center justify-between w-full">
            <span>Editar almcen</span>
            <Button
              type="primary"
              loading={updateFromPos.isPending}
              onClick={() => updateFromPos.mutate(warehouse.code)}
            >
              Sync
            </Button>
          </div>
        )
      }
      open={isOpen}
      onClose={close}
      width={500}
    >
      {warehouse && (
        <EditWarehouse
          warehouse={warehouse}
          onFinish={() => {
            refetch()
            close()
          }}
        />
      )}
    </Drawer>
  )
}

const EditWarehouse = ({
  warehouse,
  onFinish: onFinishCreate,
}: {
  warehouse: WarehouseLegal
  onFinish?: () => void
}) => {
  const [form] = Form.useForm<WarehouseLegal>()

  const updateWarehouseMt = useMutation({
    mutationFn: updateLegalWarehouse,
    onSuccess: () => {
      form.resetFields()
      onFinishCreate?.()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })

  const onFinish = async (values: WarehouseLegal) => {
    updateWarehouseMt.mutate(values)
  }

  return (
    <Form
      initialValues={
        {
          ...warehouse,
        } satisfies Partial<WarehouseLegal>
      }
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
    >
      <Form.Item name={'code'} label="Codigo" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'name'} label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={WAREHOUSE_TYPE.WAREHOUSE}>
            Almacen
          </Select.Option>
          <Select.Option value={WAREHOUSE_TYPE.STORE}>Tienda</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name={'legalName'} label="Concesionario">
        <Input />
      </Form.Item>
      <Form.Item name="legalNumber" label="RUC">
        <Input />
      </Form.Item>
      <Form.Item name="Distrito" label="Distrito">
        <Input />
      </Form.Item>
      <Form.Item name="serie" label="Serie factura">
        <Input placeholder="Ejm: F002" />
      </Form.Item>
      <Form.Item name="guideSerie" label="Serie guia">
        <Input placeholder="Ejm: 001" />
      </Form.Item>
      <Form.Item className="text-right" wrapperCol={{ offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
