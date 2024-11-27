import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { createSupplier } from '@/data/maintenance/Supplier/sdk'
import { SupplierStatus } from '@/data/maintenance/Supplier/status/status'
import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'

const { Option } = Select

export const CreateForm: React.FC<{
  supplier: ISupplier | null
  setSupplier: Dispatch<SetStateAction<ISupplier | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setSupplier, onClose, reload }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: ISupplier) => {
    try {
      await createSupplier(values)
      const idNot = toast.loading('Creando proveedor ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Proveedor creado',
        ...NOTIFICATION.updateLoading,
      })
      setSupplier(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  return (
    <Form
      form={form}
      name="createSupplier"
      onFinish={onFinish}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="supplier"
        label="Proveedor"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el proveedor',
          },
          {
            max: 150,
            message: 'El proveedor debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_name"
        label="Nombre"
        rules={[
          {
            max: 150,
            message: 'El nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_number"
        label="RUC"
        rules={[
          {
            max: 15,
            message: 'El ruc debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Direccion"
        rules={[
          {
            max: 250,
            message: 'La direccion debe tener como máximo 250 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_bco"
        label="Banco"
        rules={[
          {
            max: 15,
            message: 'El banco debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_num"
        label="Número de cuenta"
        rules={[
          {
            max: 15,
            message: 'El numero de cuenta debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_cci"
        label="Número de cuenta CCI"
        rules={[
          {
            max: 15,
            message:
              'El numero de cuenta CCI debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_cur"
        label="Moneda"
        rules={[
          {
            max: 5,
            message: 'La moneda debe tener como máximo 5 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_type"
        label="Tipo de cuenta"
        rules={[
          {
            max: 15,
            message: 'El tipo de cuenta debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={SupplierStatus.Active}>
          <Option key={SupplierStatus.Active} value={SupplierStatus.Active}>
            Activo
          </Option>
          <Option key={SupplierStatus.Inactive} value={SupplierStatus.Inactive}>
            Inactivo
          </Option>
        </Select>
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Crear
        </Button>
      </Form.Item>
    </Form>
  )
}
