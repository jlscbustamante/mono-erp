import { Button, Form, Input, Select } from 'antd'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/maintenance/Sucursal/sdk'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import { updateTerminalPost } from '@/data/maintenance/TerminalPost/sdk'
import { TerminalPostStatus } from '@/data/maintenance/TerminalPost/status/status'
import {
  ICreateTerminalPost,
  ITerminalPost,
} from '@/data/maintenance/TerminalPost/type/TerminalPost'

export const UpdateForm: React.FC<{
  terminalPost: ICreateTerminalPost | null
  setTerminalPost: Dispatch<SetStateAction<ITerminalPost | null>>
  reload: () => void
  onClose: () => void
}> = ({ setTerminalPost, terminalPost, onClose, reload }) => {
  const [form] = Form.useForm()
  const [sucursales, setSucursales] = useState<ISucursal[]>([])
  const onFinish = async (values: ITerminalPost) => {
    try {
      await updateTerminalPost(terminalPost?.id, values)
      const idNot = toast.loading(
        'Actualizando terminal ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Terminal actualizado',
        ...NOTIFICATION.updateLoading,
      })
      setTerminalPost(null)
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
      name="updateTerminalPost"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={terminalPost ? terminalPost.id : ''}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="terminal"
        label="Terminal"
        initialValue={terminalPost ? terminalPost.terminal : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el titulo de la Sucursal',
          },
          {
            max: 20,
            message: 'El Tipo debe tener como máximo 20 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="sucursal_id"
        label="Tienda"
        initialValue={terminalPost ? terminalPost.sucursal_id : ''}
      >
        <Select>
          {sucursales.map((sucursal) => (
            <Select.Option key={sucursal.id} value={sucursal.id}>
              {sucursal.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="supplier"
        label="Proveedor"
        initialValue={terminalPost ? terminalPost.supplier : ''}
      >
        <Select>
          <Select.Option value="IZIPAY">IZIPAY</Select.Option>
          <Select.Option value="CULQI">CULQI</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={
          terminalPost ? (terminalPost.status == '1' ? '1' : '0') : ''
        }
      >
        <Select>
          <Select.Option
            key={TerminalPostStatus.Active}
            value={TerminalPostStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={TerminalPostStatus.Inactive}
            value={TerminalPostStatus.Inactive}
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
