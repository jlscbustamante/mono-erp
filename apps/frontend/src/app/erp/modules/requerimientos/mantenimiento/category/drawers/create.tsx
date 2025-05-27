import { viewClient } from '@/lib/rpc'
import type { MoveCashInsert } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'

const createAtom = atom(false)

export const useCreateCategory = () => {
  const [isOpen, setIsOpen] = useAtom(createAtom)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

export const CreateCategory = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close } = useCreateCategory()
  const [form] = Form.useForm()

  const createCostCenterMt = useMutation({
    mutationFn: async (data: MoveCashInsert) => {
      const request =
        await viewClient.api.view.requirement.resource.movescash.create.$post({
          json: data,
        })
      if (!request.ok) {
        throw new Error('Error al crear el centro de costo')
      }
    },
    onSuccess: () => {
      onUpdate?.()
      close()
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const onFinish = (values: MoveCashInsert) => {
    createCostCenterMt.mutate(values)
  }

  return (
    <Drawer open={isOpen} onClose={close} title="Nueva Categoria" width={500}>
      <Form
        onFinish={onFinish}
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          status: 1,
          type_cc: 'T',
        }}
      >
        <Form.Item
          label="Nombre"
          name={'movetype'}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Flujo de cuenta"
          name={'account_flow'}
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el flujo de cuenta',
            },
          ]}
        >
          <Select>
            <Select.Option value={'I'}>Ingreso</Select.Option>
            <Select.Option value={'S'}>Salida</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Cuenta"
          name={'account_id'}
          rules={[
            { required: true, message: 'Por favor ingrese el ID de cuenta' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Flujo de efectivo"
          name={'cash_flow'}
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el flujo de efectivo',
            },
          ]}
        >
          <Select>
            <Select.Option value={'I'}>Ingreso</Select.Option>
            <Select.Option value={'S'}>Salida</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Origen"
          name={'origin_from'}
          rules={[{ required: true, message: 'Por favor ingrese el origen' }]}
        >
          <Select>
            <Select.Option value={'G'}>Gasto</Select.Option>
            <Select.Option value={'V'}>Venta</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Usado para"
          name={'used_to'}
          rules={[{ required: true, message: 'Por favor ingrese el uso' }]}
        >
          <Select>
            <Select.Option value={1}>Para las tiendas</Select.Option>
            <Select.Option value={4}>Para requerimientos</Select.Option>
            <Select.Option value={7}>Para multiple</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Estado" name={'status'}>
          <Select>
            <Select.Option value={1}>Activo</Select.Option>
            <Select.Option value={0}>Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8 }} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            loading={createCostCenterMt.isPending}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
