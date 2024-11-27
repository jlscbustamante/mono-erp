import { Button, Form, Input, Select } from 'antd'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import {
  createCourrier,
  getCourrierStores,
} from '@/data/maintenance/Courrier/sdk'
import { Shift } from '@/data/maintenance/Courrier/shift/shift'
import { CourrierStatus } from '@/data/maintenance/Courrier/status/status'
import {
  ICourrier,
  ICreateCourrier,
} from '@/data/maintenance/Courrier/type/Courrier'
import { CourrierStore } from '@/data/maintenance/Courrier/type/CourrierStore'
import { CourrierVehicule } from '@/data/maintenance/Courrier/vehicle/vehicle'

export const CreateForm: React.FC<{
  courrier: ICreateCourrier | null
  setCourrier: Dispatch<SetStateAction<ICourrier | null>>
  onClose: () => void
  reload: () => void
}> = ({ setCourrier, onClose, reload }) => {
  const [form] = Form.useForm()
  const [courrierStore, setCourrierStore] = useState<CourrierStore[]>([])
  const onFinish = async (values: ICreateCourrier) => {
    try {
      if (!values.stores) {
        values.stores = courrierStore[0]?.id
      }
      await createCourrier(values)
      const idNot = toast.loading(
        'Creando repartidor ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Repartidor creado',
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
  useEffect(() => {
    async function fetchTyeCategory() {
      try {
        const response = await getCourrierStores()
        if (response?.ok) {
          const data = await response.json()
          setCourrierStore(data)
        } else {
          console.error(
            'Error al obtener las tiendas de correos:',
            response?.statusText,
          )
        }
      } catch (error) {
        console.error('Error al obtener las tiendas de correos:', error)
      }
    }

    fetchTyeCategory()
  }, [])

  return (
    <Form
      form={form}
      name="createCourrier"
      onFinish={onFinish}
      labelCol={{ span: 11 }}
      wrapperCol={{ span: 150 }}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Telefono"
        rules={[{ required: true, message: 'Por favor ingresa el telefono' }]}
      >
        <Input onChange={handlePhoneChange} />
      </Form.Item>
      <Form.Item
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
        name="password"
        label="Contraseña"
        rules={[
          { required: true, message: 'Por favor ingresa tu contraseña' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="doc_type" label="Tipo documento">
        <Input />
      </Form.Item>
      <Form.Item name="doc_number" label="N° documento">
        <Input />
      </Form.Item>
      <Form.Item name="vehicle" label="Vehiculo">
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
      <Form.Item name="plate" label="Placa">
        <Input />
      </Form.Item>

      <Form.Item name="shift_hired" label="Turno">
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
      <Form.Item name="tienda" label="Tienda">
        <Select
          showSearch
          placeholder="Selecciona una tienda"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option && option.children
              ? option.children
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              : false
          }
        >
          {courrierStore.map((store) => (
            <Select.Option key={store.id} value={store.id}>
              {store.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="status" label="Estado">
        <Select defaultValue={CourrierStatus.Active}>
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
          Crear
        </Button>
      </Form.Item>
    </Form>
  )
}
