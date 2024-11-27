import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateSucursal } from '@/data/maintenance/Sucursal/sdk'
import { SucursalStatus } from '@/data/maintenance/Sucursal/status/status'
import {
  ICreateSucursal,
  ISucursal,
} from '@/data/maintenance/Sucursal/type/Sucursal'

export const UpdateForm: React.FC<{
  sucursal: ICreateSucursal | null
  setSucursal: Dispatch<SetStateAction<ISucursal | null>>
  onClose: () => void
  reload: () => void
}> = ({ setSucursal, sucursal, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ISucursal) => {
    try {
      await updateSucursal(sucursal?.id, values)
      const idNot = toast.loading(
        'Actualizando tienda ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tienda actualizada',
        ...NOTIFICATION.updateLoading,
      })
      form.resetFields()
      setSucursal(null)
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Form
      form={form}
      name="updateSucursal"
      onFinish={onFinish}
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={sucursal ? sucursal.id : ''}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="title"
        label="Tienda"
        initialValue={sucursal ? sucursal.title : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el titulo de la Sucursal',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_address"
        label="Direccion"
        initialValue={sucursal ? sucursal.ubi_address : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_district"
        label="Distrito"
        initialValue={sucursal ? sucursal.ubi_district : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ubi_city"
        label="Cuidad"
        initialValue={sucursal ? sucursal.ubi_city : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="type_sede"
        label="Tipo de Sede"
        initialValue={sucursal ? sucursal.type_sede : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_name"
        label="Persona contrato"
        initialValue={sucursal ? sucursal.legalperson_name : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_doctype"
        label="Tipo de documento"
        initialValue={sucursal ? sucursal.legalperson_doctype : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_docnum"
        label="Documento"
        initialValue={sucursal ? sucursal.legalperson_docnum : ''}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="legalperson_account_bco"
        label="Banco"
        initialValue={sucursal ? sucursal.legalperson_account_bco : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_num"
        label="Número de cuenta"
        initialValue={sucursal ? sucursal.legalperson_account_num : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_cci"
        label="Número de cuenta CCI"
        initialValue={sucursal ? sucursal.legalperson_account_cci : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_cur"
        label="Moneda"
        initialValue={sucursal ? sucursal.legalperson_account_cur : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="legalperson_account_type"
        label="Tipo de cuenta"
        initialValue={sucursal ? sucursal.legalperson_account_type : ''}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={sucursal ? (sucursal.status == '1' ? '1' : '0') : ''}
      >
        <Select>
          <Select.Option
            key={SucursalStatus.Active}
            value={SucursalStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={SucursalStatus.Inactive}
            value={SucursalStatus.Inactive}
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
