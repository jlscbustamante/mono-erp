import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { useParametersQuery } from '@/hooks/useParamters'
import { filterSelectForm } from '@/utils'

import { rhApi } from '@/lib/api/rh'
import { updateCourier } from '../api'
import { CourierShift, CourierVehicle, DocType, IUpdateCourier } from '../types'
import { useCouriers } from '../useCouriers'
import { useListStores } from '../useListStores'

import { commonApi } from '@/lib/api/common'
import { useSession } from '@/app/erp/use-session'
import { ITEM } from '@/const/localStorageItems'

const editDrawerAtom = atom<{
  isOpen: boolean
  id: null | number
}>({
  key: 'editDrawrAtom',
  default: {
    isOpen: false,
    id: null,
  },
})
const keys = {
  id: 'id',
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
} as Record<keyof IUpdateCourier, keyof IUpdateCourier>

export const useEditDrawer = () => {
  const [value, setValue] = useRecoilState(editDrawerAtom)

  const open = (id: number) =>
    setValue({
      isOpen: true,
      id,
    })
  const close = () =>
    setValue({
      isOpen: false,
      id: null,
    })

  return {
    isOpen: value.isOpen,
    open,
    close,
    id: value.id,
  }
}

export const UpdateDrawer = () => {
  const { isOpen, close, id } = useEditDrawer()
  const [form] = Form.useForm<IUpdateCourier>()
  const { data: stores } = useListStores()
  const { data: parameterData } = useParametersQuery()
  const { data, refetch } = useCouriers(parameterData?.ciaIdMoturider ?? null)
  const courier = useMemo(() => {
    const founded = data?.find((el) => el.id === id)
    if (founded) {
      form.setFieldsValue(founded)
    }
    return founded
  }, [data, id])
  const userName = useSession((st) => st.user.userName)
  const userId = useSession((st) => st.user.userId)
  const userMail = useSession((st) => st.user.mail)

  const mutation = useMutation({
    // mutationFn: updateCourier,
    mutationFn: async (dataUpdate: IUpdateCourier) => {
      if (!parameterData || !parameterData?.ciaIdMoturider)
        throw new Error('No se encontro cia_id de la empresa en parametros.')

      const originalDoc = courier?.doc_number
      const dataTrace = await updateCourier(
        parameterData.ciaIdMoturider,
        dataUpdate,
      )
      await rhApi.saveMotorizer({
        ...dataUpdate,
        original_doc: originalDoc,
      })
      //console.log('dataUpdate')
      //console.dir(dataUpdate)
      //console.log('originalDoc')
      //console.dir(originalDoc)
      console.log('dataTrace de motorizado')
      console.dir(dataTrace)

      ////console.dir(dataTrace)
      //crear el iamlog
      //..obtener los datos del usuario

      //console.log('Dx Session')
      //console.log(userId)
      const argsIamLog = {
        user_id: userId,
        user_name: userName,
        user_email: userMail,
        module_id: 4,
        module_name: 'Mantenimiento',
        action: 'EDIT',
        tbl_name: '_tbl_externa_motorizado',
        tbl_primary_id: dataUpdate.id,
      }
      //console.log('RegIamLog')
      //console.dir(argsIamLog)

      commonApi.createIamLog(argsIamLog)
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      refetch()
      toast.success('Motorizado actualizado', {
        autoClose: 1200,
      })
      close()
      form.resetFields()
    },
  })

  return (
    <Drawer
      open={isOpen}
      onClose={() => close()}
      title={'Actualizar motorizado'}
      width={500}
    >
      {courier && (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={mutation.mutate}
          form={form}
        >
          <Form.Item label="Id" rules={[{ required: true }]} name={keys.id}>
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Nombre"
            rules={[{ required: true }]}
            name={keys.name}
          >
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
              <Select.Option value={CourierVehicle.BIKE}>
                Bicicleta
              </Select.Option>
              <Select.Option value={CourierVehicle.CAR}>Auto</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Placa" name={keys.plate}>
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
            name={keys.store_code}
          >
            <Select showSearch={true} filterOption={filterSelectForm}>
              {stores.map((el) => {
                return (
                  <Select.Option
                    key={el.store_id}
                    value={el.store_id.toString()}
                  >
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
            <Button
              htmlType="submit"
              type="primary"
              loading={mutation.isPending}
            >
              Guardar
            </Button>
          </div>
        </Form>
      )}
    </Drawer>
  )
}
