import { viewClient } from '@/lib/rpc'
import { CashBankSelect } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { CreateCostCenterDto } from '@view'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { CompanySelectForm } from '../../../components/company-select'
import { StoreSelectForm } from '../../../components/stores-select'

const updateCashBank = atom<null | CashBankSelect>(null)

export const useUpdateCashBank = () => {
  const [isOpen, setIsOpen] = useAtom(updateCashBank)

  return {
    cashBank: isOpen,
    isOpen: !!isOpen,
    open: (cashBank: CashBankSelect) => setIsOpen(cashBank),
    close: () => setIsOpen(null),
  }
}

export const UpdateCashBank = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close, cashBank } = useUpdateCashBank()
  const [form] = Form.useForm()

  const updateCashBankMt = useMutation({
    mutationFn: async (data: CreateCostCenterDto) => {
      const request = await viewClient.api.view.cashbank.update.$put({
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

  const onFinish = (values: CreateCostCenterDto) => {
    updateCashBankMt.mutate(values)
  }

  useEffect(() => {
    if (cashBank) {
      form.setFieldsValue({
        id: cashBank.id,
        cashbank: cashBank.cashbank,
        account_id: cashBank.account_id,
        company_id: cashBank.company_id,
        type_cash: cashBank.type_cash,
        sucursal_id: cashBank.sucursal_id,
        status: cashBank.status,
      })
    }
  }, [cashBank])

  return (
    <Drawer open={isOpen} onClose={close} title="Editar caja" width={500}>
      {cashBank && (
        <Form
          onFinish={onFinish}
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item name={'id'} rules={[{ required: true }]} label="Id">
            <Input readOnly />
          </Form.Item>
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
          <Form.Item
            label="Tipo"
            name={'type_cash'}
            rules={[{ required: true }]}
          >
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
              loading={updateCashBankMt.isPending}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}
