import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'

const createAtom = atom(false)

export const useCreateCostCenter = () => {
  const [isOpen, setIsOpen] = useAtom(createAtom)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

export const CreateCostCenter = () => {
  const { isOpen, close } = useCreateCostCenter()
  const [form] = Form.useForm()

  return (
    <Drawer
      open={true}
      onClose={close}
      title="Nuevo centro de costo"
      width={500}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item label="Nombre">
          <Input />
        </Form.Item>
        <Form.Item label="Compañia">
          <Select>
            <Select.Option value="1">Compañia 1</Select.Option>
            <Select.Option value="2">Compañia 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tienda">
          <Select>
            <Select.Option value="1">Tienda 1</Select.Option>
            <Select.Option value="2">Tienda 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tipo">
          <Select>
            <Select.Option value="1">Tipo 1 </Select.Option>
            <Select.Option value="2">Tipo 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Cuenta 1">
          <Input />
        </Form.Item>
        <Form.Item label="Cuenta 2">
          <Input />
        </Form.Item>
        <Form.Item label="Cuenta 3">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }} className="text-right">
          <Button type="primary">Guardar</Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
