import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateSupplier } from '@/data/maintenance/Supplier/sdk'
import { SupplierStatus } from '@/data/maintenance/Supplier/status/status'
import {
  ICreateSupplier,
  ISupplier,
} from '@/data/maintenance/Supplier/type/Supplier'

export const UpdateForm: React.FC<{
  supplier: ICreateSupplier | null
  setSupplier: Dispatch<SetStateAction<ISupplier | null>>
  onClose: () => void
  reload: () => void
}> = ({ setSupplier, supplier, onClose, reload }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: ISupplier) => {
    try {
      await updateSupplier(supplier?.id, values)
      const idNot = toast.loading(
        'Actualizando proveedor ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Proveedor actualizado',
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
      name="updateSupplier"
      onFinish={onFinish}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={supplier ? supplier.id : ''}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="supplier"
        label="Proveedor"
        initialValue={supplier ? supplier.supplier : ''}
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
        initialValue={supplier ? supplier.legal_name : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_number"
        label="RUC"
        initialValue={supplier ? supplier.legal_number : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Direccion"
        initialValue={supplier ? supplier.address : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_bco"
        label="Banco"
        initialValue={supplier ? supplier.legal_account_bco : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_num"
        label="Número de cuenta"
        initialValue={supplier ? supplier.legal_account_num : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_cci"
        label="Número de cuenta CCI"
        initialValue={supplier ? supplier.legal_account_cci : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_cur"
        label="Moneda"
        initialValue={supplier ? supplier.legal_account_cur : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legal_account_type"
        label="Tipo de cuenta"
        initialValue={supplier ? supplier.legal_account_type : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="status"
        label="Estado"
        initialValue={supplier ? (supplier.status == '1' ? '1' : '0') : ''}
      >
        <Select>
          <Select.Option
            key={SupplierStatus.Active}
            value={SupplierStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={SupplierStatus.Inactive}
            value={SupplierStatus.Inactive}
          >
            Inactivo
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
