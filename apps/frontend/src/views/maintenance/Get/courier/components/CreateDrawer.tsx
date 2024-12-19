import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Password from 'antd/es/input/Password'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { useParametersQuery } from '@/hooks/useParamters'
import { filterSelectForm } from '@/utils'

import { rhApi } from '@/lib/api/rh'
import { createCourier } from '../api'
import { CourierShift, CourierVehicle, DocType, ICreateCourier } from '../types'
import { useCouriers } from '../useCouriers'
import { useListStores } from '../useListStores'

const createDrawerAtom = atom({
  key: 'createDrawerAtom',
  default: false,
})
const keys = {
  name: 'name',
  phone: 'phone',
  email: 'email',
  password: 'password',
  doc_type: 'doc_type',
  vehicle: 'vehicle',
  plate: 'plate',
  shift_hired: 'shift_hired',
  store_code: 'store_code',
  status: 'status',
  doc_number: 'doc_number',
  store_id: 'store_id',
} as Record<keyof ICreateCourier, keyof ICreateCourier>

export const useCreateDrawer = () => {
  const [value, setValue] = useRecoilState(createDrawerAtom)

  const open = () => setValue(true)
  const close = () => setValue(false)

  return {
    isOpen: value,
    open,
    close,
  }
}

export const CreateDrawer = () => {
  const { isOpen, close } = useCreateDrawer()
  const [form] = useForm<ICreateCourier>()
  const { data: stores } = useListStores()
  const { data } = useParametersQuery()
  const { refetch } = useCouriers(data?.ciaIdMoturider ?? null)

  const mutation = useMutation({
    mutationFn: async (dataCreate: ICreateCourier) => {
      if (!data || !data?.ciaIdMoturider)
        throw new Error('No se encontro cia_id de la empresa en parametros')
      // return await createCourier(data.ciaIdMoturider, dataCreate)
      // return await Promise.all([
      //   createCourier(data.ciaIdMoturider, dataCreate),
      //   rhApi.saveMotorizer(dataCreate),
      // ])
      await createCourier(data.ciaIdMoturider, dataCreate)
      await rhApi.saveMotorizer(dataCreate)
    },

    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      refetch()
      toast.success('Motorizado creado')
      close()
      form.resetFields()
    },
  })

  return (
    <Drawer
      open={isOpen}
      onClose={() => close()}
      title={'Nuevo motorizado'}
      width={500}
    >
      <Form
        initialValues={{
          [keys.doc_type]: DocType.DNI,
          [keys.status]: 1,
          [keys.vehicle]: CourierVehicle.MOTORCYCLE,
        }}
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={mutation.mutate}
      >
        <Form.Item label="Nombre" rules={[{ required: true }]} name={keys.name}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Telefono"
          rules={[{ required: true }]}
          name={keys.phone}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Correo" name={keys.email}>
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          rules={[{ required: true }]}
          name={keys.password}
        >
          <Password visibilityToggle />
        </Form.Item>
        <Form.Item label="Tipo de documento" name={keys.doc_type}>
          <Select>
            <Select.Option value={DocType.DNI}>DNI</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="N° documento"
          name={keys.doc_number}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Vehiculo" name={keys.vehicle}>
          <Select>
            <Select.Option value={CourierVehicle.MOTORCYCLE}>
              Moto
            </Select.Option>
            <Select.Option value={CourierVehicle.BIKE}>Bicicleta</Select.Option>
            <Select.Option value={CourierVehicle.CAR}>Auto</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={keys.plate} label="Placa">
          <Input />
        </Form.Item>
        <Form.Item
          label="Turno"
          name={keys.shift_hired}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={CourierShift.FULLTIME}>
              Tiempo completo
            </Select.Option>
            <Select.Option value={CourierShift.PARTTIME}>
              Medio tiempo
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Tienda"
          rules={[{ required: true }]}
          name={keys.store_id}
        >
          <Select showSearch={true} filterOption={filterSelectForm}>
            {stores.map((el) => {
              return (
                <Select.Option key={el.store_code} value={el.store_id}>
                  {el.store_name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Estado"
          rules={[{ required: true }]}
          name={keys.status}
        >
          <Select>
            <Select.Option value={1}>Activo</Select.Option>
            <Select.Option value={0}>Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <div className="text-right">
          <Button htmlType="submit" type="primary" loading={mutation.isPending}>
            Guardar
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}
