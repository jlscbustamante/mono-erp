import { viewClient } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { CreateCostCenterDto } from '@view'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'
import { CompanySelectForm } from '../../../components/company-select'
import { StoreSelectForm } from '../../../components/stores-select'

const createAtom = atom(false)

export const useCreateCostCenter = () => {
  const [isOpen, setIsOpen] = useAtom(createAtom)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

export const CreateCostCenter = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close } = useCreateCostCenter()
  const [form] = Form.useForm()

  const createCostCenterMt = useMutation({
    mutationFn: async (data: CreateCostCenterDto) => {
      const request =
        await viewClient.api.view.requirement.resource.costCenters.create.$post(
          {
            json: data,
          },
        )
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

  const onFinish = (values: CreateCostCenterDto) => {
    createCostCenterMt.mutate(values)
  }

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title="Nuevo centro de costo"
      width={500}
    >
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
          name={'costcenter'}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Compañia" name={'company_id'}>
          <CompanySelectForm />
        </Form.Item>
        <Form.Item label="Tienda" name={'sucursal_id'}>
          <StoreSelectForm />
        </Form.Item>
        <Form.Item label="Tipo" name={'type_cc'} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="T">Tienda</Select.Option>
            <Select.Option value="A">Area oficina</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Cuenta 1" name={'account_link1'}>
          <Input />
        </Form.Item>
        <Form.Item label="Cuenta 2" name={'account_link2'}>
          <Input />
        </Form.Item>
        <Form.Item label="Cuenta 3" name={'account_link3'}>
          <Input />
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
