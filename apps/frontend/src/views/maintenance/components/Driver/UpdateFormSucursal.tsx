import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import {
  getCourrierStores,
  updateCourrierStore,
} from '@/data/maintenance/Courrier/sdk'
import {
  ICourrier,
  ICreateCourrier,
} from '@/data/maintenance/Courrier/type/Courrier'
import { CourrierStore } from '@/data/maintenance/Courrier/type/CourrierStore'
import { CourrierStoreUpdate } from '@/data/maintenance/Courrier/type/CourrierStoreUpdate'

export const UpdateSucursalForm: React.FC<{
  onClose: () => void
  reload: () => void
  driver: ICreateCourrier | null
  setDriver: Dispatch<SetStateAction<ICourrier | null>>
}> = ({ setDriver, driver, onClose, reload }) => {
  const [form] = Form.useForm()
  const [sucursal, setSucursal] = useState<CourrierStore[]>([])
  const onFinish = async (values: CourrierStoreUpdate) => {
    try {
      await updateCourrierStore(driver?.id, values.store)
      const idNot = toast.loading(
        'Actualizando tienda de repartidor ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Tienda actualizada',
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

  useEffect(() => {
    async function fetchTyeCategory() {
      try {
        const response = await getCourrierStores()
        if (response?.ok) {
          const data = await response.json()
          setSucursal(data)
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
      name="updateDriver"
      onFinish={onFinish}
      labelCol={{ span: 11 }}
      wrapperCol={{ span: 150 }}
    >
      <Form.Item name="id" label="ID" initialValue={driver ? driver.id : ''}>
        <Input disabled />
      </Form.Item>

      <Form.Item name="store" label="Tienda">
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
          {sucursal.map((store) => (
            <Select.Option key={store.id} value={store.id}>
              {store.title}
            </Select.Option>
          ))}
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
