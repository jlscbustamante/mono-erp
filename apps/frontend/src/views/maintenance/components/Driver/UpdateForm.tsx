import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateCourrier } from '@/data/maintenance/Courrier/sdk'
import { Shift } from '@/data/maintenance/Courrier/shift/shift'
import { CourrierStatus } from '@/data/maintenance/Courrier/status/status'
import {
  ICourrier,
  ICreateCourrier,
} from '@/data/maintenance/Courrier/type/Courrier'
import { CourrierVehicule } from '@/data/maintenance/Courrier/vehicle/vehicle'

export const UpdateForm: React.FC<{
  onClose: () => void
  reload: () => void
  courrier: ICreateCourrier | null
  setCourrier: Dispatch<SetStateAction<ICourrier | null>>
}> = ({ setCourrier, courrier, onClose, reload }) => {
  const [form] = Form.useForm()
  const onFinish = async (values: ICreateCourrier) => {
    try {
      await updateCourrier(courrier?.id, values)
      const idNot = toast.loading(
        'Actualizando repartidor ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Repartidor actualizado',
        ...NOTIFICATION.updateLoading,
      })
      setCourrier(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  const handlePhoneChange = (e: any) => {
    const phoneValue = e.target.value
    const emailValue = `${phoneValue}@pizzaraul.com`
    form.setFieldsValue({ email: emailValue })
  }
  return (
    <Form
      form={form}
      name="updateCourrier"
      onFinish={onFinish}
      labelCol={{ span: 11 }}
      wrapperCol={{ span: 150 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={courrier ? courrier.id : ''}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        initialValue={courrier ? courrier.name : ''}
        name="name"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        initialValue={courrier ? courrier.phone : ''}
        name="phone"
        label="Telefono"
        rules={[{ required: true, message: 'Por favor ingresa el telefono' }]}
      >
        <Input onChange={handlePhoneChange} />
      </Form.Item>
      <Form.Item
        initialValue={courrier ? courrier.email : ''}
        name="email"
        label="Correo"
        rules={[
          { required: true, message: 'Por favor ingresa el correo' },
          { type: 'email', message: 'Por favor ingresa un correo valido' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="doc_type"
        label="Tipo documento"
        initialValue={courrier ? courrier.doc_type : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="doc_number"
        label="N° documento"
        initialValue={courrier ? courrier.doc_number : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="vehicle"
        label="Vehiculo"
        initialValue={courrier ? courrier.vehicle : ''}
      >
        <Select>
          <Select.Option
            key={CourrierVehicule.Motocicleta}
            value={CourrierVehicule.Motocicleta}
          >
            Motocicleta
          </Select.Option>
          <Select.Option
            key={CourrierVehicule.Auto}
            value={CourrierVehicule.Auto}
          >
            Auto
          </Select.Option>
          <Select.Option
            key={CourrierVehicule.Bicicleta}
            value={CourrierVehicule.Bicicleta}
          >
            Bicicleta
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="plate"
        label="Placa"
        initialValue={courrier ? courrier.plate : ''}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="shift_hired"
        label="Turno"
        initialValue={courrier ? courrier.shift_hired : ''}
      >
        <Select>
          <Select.Option key={Shift.FULLTIME} value={Shift.FULLTIME}>
            FULL TIME
          </Select.Option>
          <Select.Option key={Shift.PARTTIME} value={Shift.PARTTIME}>
            PART TIME
          </Select.Option>
          <Select.Option key={Shift.EVENTUAL} value={Shift.EVENTUAL}>
            EVENTUAL
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="status"
        label="Estado"
        initialValue={courrier ? courrier.status : ''}
      >
        <Select>
          <Select.Option
            key={CourrierStatus.Active}
            value={CourrierStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={CourrierStatus.Inactive}
            value={CourrierStatus.Inactive}
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
