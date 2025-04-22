import { viewClient } from '@/lib/rpc'
import { MoveCashSelect } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

const updateCostCenterAtom = atom<null | MoveCashSelect>(null)

export const useUpdateCategory = () => {
  const [isOpen, setIsOpen] = useAtom(updateCostCenterAtom)

  return {
    category: isOpen,
    isOpen: !!isOpen,
    open: (costCenter: MoveCashSelect) => setIsOpen(costCenter),
    close: () => setIsOpen(null),
  }
}

export const UpdateCategory = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close, category } = useUpdateCategory()
  const [form] = Form.useForm()

  const updateCategoryMt = useMutation({
    mutationFn: async (data: MoveCashSelect) => {
      const request =
        await viewClient.api.view.requirement.resource.movescash.update.$put({
          json: data,
        })
      if (!request.ok) {
        throw new Error('Error al crear categoria')
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

  const onFinish = (values: MoveCashSelect) => {
    updateCategoryMt.mutate(values)
  }

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        id: category.id,
        movetype: category.movetype,
        account_flow: category.account_flow,
        account_id: category.account_id,
        cash_flow: category.cash_flow,
        origin_from: category.origin_from,
        used_to: category.used_to,
        status: category.status,
      } satisfies Partial<MoveCashSelect>)
    }
  }, [category])

  return (
    <Drawer open={isOpen} onClose={close} title="Nuevo categoria" width={500}>
      {category && (
        <Form
          key={category.id}
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
            name={'movecash'}
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
              loading={updateCategoryMt.isPending}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}
