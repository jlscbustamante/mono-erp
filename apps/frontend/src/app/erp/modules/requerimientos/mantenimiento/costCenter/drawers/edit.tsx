import { viewClient } from '@/lib/rpc'
import { CostCenterSelecet } from '@pizzadb'
import { useMutation } from '@tanstack/react-query'
import { CreateCostCenterDto } from '@view'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { atom, useAtom } from 'jotai'
import { CompanySelectForm } from '../../../components/company-select'
import { StoreSelectForm } from '../../../components/stores-select'

const createAtom = atom<null | CostCenterSelecet>(null)

export const useUpdateCostCenter = () => {
  const [isOpen, setIsOpen] = useAtom(createAtom)

  return {
    costCenter: isOpen,
    isOpen: !!isOpen,
    open: (costCenter: CostCenterSelecet) => setIsOpen(costCenter),
    close: () => setIsOpen(null),
  }
}

export const UpdateCostCenter = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { isOpen, close, costCenter } = useUpdateCostCenter()
  const [form] = Form.useForm()

  const updateCostCenterMt = useMutation({
    mutationFn: async (data: CreateCostCenterDto) => {
      const request =
        await viewClient.api.view.requirement.resource.costCenters.update.$post(
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
    updateCostCenterMt.mutate(values)
  }

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title="Nuevo centro de costo"
      width={500}
    >
      {costCenter && (
        <Form
          onFinish={onFinish}
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            id: costCenter.id,
            costcenter: costCenter.costcenter,
            company_id: costCenter.company_id,
            sucursal_id: costCenter.sucursal_id,
            type_cc: costCenter.type_cc,
            account_link1: costCenter.account_link1,
            account_link2: costCenter.account_link2,
            account_link3: costCenter.account_link3,
            status: costCenter.status,
          }}
        >
          <Form.Item name={'id'} rules={[{ required: true }]} label="Id">
            <Input readOnly />
          </Form.Item>
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
              loading={updateCostCenterMt.isPending}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  )
}
