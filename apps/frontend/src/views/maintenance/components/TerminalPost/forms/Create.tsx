import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/maintenance/Sucursal/sdk'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import { createTerminalPost } from '@/data/maintenance/TerminalPost/sdk'
import { TerminalPostStatus } from '@/data/maintenance/TerminalPost/status/status'
import { ITerminalPost } from '@/data/maintenance/TerminalPost/type/TerminalPost'
const { Option } = Select

export const CreateForm: React.FC<{
  terminalPost: ITerminalPost | null
  setTerminalpost: Dispatch<SetStateAction<ITerminalPost | null>>
  showUnsign?: boolean
  onClose: () => void
  reload: () => void
}> = ({ setTerminalpost, onClose, reload }) => {
  const [form] = Form.useForm()
  const [sucursales, setSucursales] = useState<ISucursal[]>([])

  const onFinish = async (values: ITerminalPost) => {
    try {
      await createTerminalPost(values)
      const idNot = toast.loading('Creando terminal  ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Terminal creado',
        ...NOTIFICATION.updateLoading,
      })
      setTerminalpost(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  useEffect(() => {
    async function fetchSucursales() {
      try {
        const response = await sdk.getSucursal()

        setSucursales(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSucursales()
  }, [])
  return (
    <Form
      form={form}
      name="createTerminalPost"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="terminal"
        label="Terminal"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el terminal',
          },
          {
            max: 20,
            message: 'El Terminal debe tener como máximo 20 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="sucursal_id" label="Tienda">
        <Select>
          {sucursales.map((sucursal) => (
            <Select.Option key={sucursal.id} value={sucursal.id}>
              {sucursal.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="supplier" label="Proveedor">
        <Select>
          <Select.Option value="IZIPAY">IZIPAY</Select.Option>
          <Select.Option value="CULQI">CULQI</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="status" label="Estado">
        <Select defaultValue={TerminalPostStatus.Active}>
          <Option
            key={TerminalPostStatus.Active}
            value={TerminalPostStatus.Active}
          >
            Activo
          </Option>
          <Option
            key={TerminalPostStatus.Inactive}
            value={TerminalPostStatus.Inactive}
          >
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
