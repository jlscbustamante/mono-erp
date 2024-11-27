import { Button, Form, Input } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateCourrierPassword } from '@/data/maintenance/Courrier/sdk'
import {
  ICourrier,
  ICreateCourrier,
  IUpdateCourrier,
} from '@/data/maintenance/Courrier/type/Courrier'

export const UpdatePasswordForm: React.FC<{
  onClose: () => void
  reload: () => void
  driver: ICreateCourrier | null
  setDriver: Dispatch<SetStateAction<ICourrier | null>>
}> = ({ setDriver, driver, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: IUpdateCourrier) => {
    try {
      await updateCourrierPassword(driver?.id, values)
      const idNot = toast.loading(
        'Actualizando contraseña de repartidor ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Contraseña actualizada',
        ...NOTIFICATION.updateLoading,
      })
      setDriver(null)
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
      name="updateDriver"
      onFinish={onFinish}
      labelCol={{ span: 11 }}
      wrapperCol={{ span: 150 }}
    >
      <Form.Item name="id" label="ID" initialValue={driver ? driver.id : ''}>
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[
          { required: true, message: 'Por favor ingresa tu contraseña' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
