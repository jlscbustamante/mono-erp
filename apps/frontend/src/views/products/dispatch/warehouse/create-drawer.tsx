import { createLegalWarehouse } from '@/data/hex/inventory'
import { WAREHOUSE_TYPE, WarehouseLegal } from '@/data/hex/types'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import { useFilterSucurales } from './state'

const createWarehouseAtom = atom<boolean>({
  key: 'createWarehouseAtom',
  default: false,
})

export const useCreateWarehouse = () => {
  const [createWarehouse, setCreateWarehouse] =
    useRecoilState(createWarehouseAtom)

  const open = () => {
    setCreateWarehouse(true)
  }
  const close = () => {
    setCreateWarehouse(false)
  }

  return {
    isOpen: createWarehouse,
    open,
    close,
  }
}

export const CreateDrawer = () => {
  const { isOpen, close } = useCreateWarehouse()
  const { refetch } = useFilterSucurales()

  const [form] = Form.useForm<WarehouseLegal>()

  const createWarehouseMt = useMutation({
    mutationFn: createLegalWarehouse,
    onSuccess: () => {
      refetch()
      form.resetFields()
      close()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })

  const onFinish = async (values: WarehouseLegal) => {
    createWarehouseMt.mutate(values)
  }

  return (
    <Drawer title="Crear Almacen" open={isOpen} onClose={close} width={500}>
      <Form
        initialValues={
          {
            code: '',
            name: '',
            type: WAREHOUSE_TYPE.WAREHOUSE,
            legalName: '',
            legalAddress: '',
            serie: '',
            guideSerie: '',
            district: '',
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
            {/* <Select.Option value={WAREHOUSE_TYPE.STORE}>Tienda</Select.Option> */}
          </Select>
        </Form.Item>
        <Form.Item name={'legalName'} label="Concesionario ">
          <Input />
        </Form.Item>
        <Form.Item name="legalNumber" label="RUC">
          <Input />
        </Form.Item>
        <Form.Item name="district" label="Distrito">
          <Input />
        </Form.Item>
        <Form.Item name="legalAddress" label="Dirección">
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
    </Drawer>
  )
}
