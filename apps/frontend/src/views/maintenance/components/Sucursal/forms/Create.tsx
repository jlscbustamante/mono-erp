import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { createSucursal } from '@/data/maintenance/Sucursal/sdk'
import { SucursalStatus } from '@/data/maintenance/Sucursal/status/status'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'

const { Option } = Select
export const CreateForm: React.FC<{
  sucursal: ISucursal | null
  setSucursal: Dispatch<SetStateAction<ISucursal | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setSucursal, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ISucursal) => {
    try {
      await createSucursal(values)

      const idNot = toast.loading('Creando tienda ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Tienda creada',
        ...NOTIFICATION.updateLoading,
      })

      onClose()
      setSucursal(null)
      form.resetFields()
      reload()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Form
      form={form}
      name="createSucursal"
      onFinish={onFinish}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el ID de la Sucursal',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="title"
        label="Tienda"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el titulo de la Sucursal',
          },
          {
            max: 150,
            message: 'El Titulo debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_address"
        label="Direccion"
        rules={[
          {
            max: 250,
            message: 'El Ubi_address debe tener como máximo 250 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_district"
        label="Distrito"
        rules={[
          {
            max: 50,
            message: 'El Ubi_disctrict debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_city"
        label="Cuidad"
        rules={[
          {
            max: 50,
            message: 'El Ubi_city debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="type_sede"
        label="Tipo de tienda"
        rules={[
          {
            max: 1,
            message: 'Ubi_sede debe tener como máximo 1 caracter',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_name"
        label="Representante legal"
        rules={[
          {
            max: 150,
            message:
              'El Legalperson_name debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_doctype"
        label="Tipo documento"
        rules={[
          {
            max: 10,
            message:
              'El legalperson_doctype debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_docnum"
        label="Número documento"
        rules={[
          {
            max: 15,
            message:
              'El Legalperson_docmun debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="legalperson_account_bco"
        label="Banco"
        rules={[
          {
            max: 15,
            message:
              'El Legalpeson-account_bco debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_num"
        label="Número de cuenta"
        rules={[
          {
            max: 15,
            message:
              'El legalperson_account_num debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_cci"
        label="Número de cuenta CCI"
        rules={[
          {
            max: 15,
            message:
              'El Legalperson_account_cci debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_cur"
        label="Moneda"
        rules={[
          {
            max: 5,
            message:
              'El legalperson_account_cur debe tener como máximo 5 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_type"
        label="Tipo de cuenta"
        rules={[
          {
            max: 15,
            message:
              'El legalperson_account_type debe tener como máximo 15 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={SucursalStatus.Active}>
          <Option key={SucursalStatus.Active} value={SucursalStatus.Active}>
            Activo
          </Option>
          <Option key={SucursalStatus.Inactive} value={SucursalStatus.Inactive}>
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
