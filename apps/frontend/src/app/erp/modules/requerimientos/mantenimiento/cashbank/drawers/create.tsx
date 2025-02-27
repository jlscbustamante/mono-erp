import { viewClient } from '@/lib/rpc'
import { useMutation } from '@tanstack/react-query'
import { CreateCashBankDto } from '@view'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'
import { CompanySelectForm } from '../../../components/company-select'
import { StoreSelectForm } from '../../../components/stores-select'

const createAtom = atom(false)

export const useCreateCashBank = () => {
  const [isOpen, setIsOpen] = useAtom(createAtom)

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

export const CreateCashBank = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close } = useCreateCashBank()
  const [form] = Form.useForm()

  const createCashBankMt = useMutation({
    mutationFn: async (data: CreateCashBankDto) => {
      const request = await viewClient.api.view.cashbank.create.$post({
        json: data,
      })
      if (!request.ok) {
        throw new Error('Error al crear el centro de costo')
      }
    },
    onSuccess: () => {
      onUpdate?.()
      close()
      form.resetFields()
    },
    onError: (err) => {
      console.error(err)
    },
  })

  const onFinish = (values: CreateCashBankDto) => {
    createCashBankMt.mutate(values)
  }

  return (
    <Drawer open={isOpen} onClose={close} title="Nueva caja" width={500}>
      <Form
        onFinish={onFinish}
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          status: 1,
          type_cash: 1,
        }}
      >
        <Form.Item
          label="Nombre"
          name={'cashbank'}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Cuenta"
          name={'account_id'}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Compañia"
          name={'company_id'}
          rules={[{ required: true }]}
        >
          <CompanySelectForm />
        </Form.Item>
        <Form.Item label="Tienda" name={'sucursal_id'}>
          <StoreSelectForm />
        </Form.Item>
        <Form.Item label="Tipo" name={'type_cash'} rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>Tiendas</Select.Option>
            <Select.Option value={3}>Banco</Select.Option>
            <Select.Option value={4}>Central</Select.Option>
            <Select.Option value={5}>Corales</Select.Option>
            <Select.Option value={6}>Liquidadora</Select.Option>
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
            loading={createCashBankMt.isPending}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
