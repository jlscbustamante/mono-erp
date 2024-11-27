import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import { CostCenterIs_cash } from '@/data/maintenance/CostCenter/is_cash/is_cash'
import { createCostCenter } from '@/data/maintenance/CostCenter/sdk'
import { CostCenterStatus } from '@/data/maintenance/CostCenter/status/status'
import {
  ICostCenter,
  ICreateCostCenter,
} from '@/data/maintenance/CostCenter/type/CostCenter'
import { Account } from '@/data/types'
const { Option } = Select
export const CreateForm: React.FC<{
  costCenter: ICreateCostCenter | null
  setCostCenter: Dispatch<SetStateAction<ICostCenter | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setCostCenter, onClose, reload }) => {
  const [form] = Form.useForm()
  const [cashAccount, setCashAccount] = useState<Account[]>([])
  const onFinish = async (values: ICreateCostCenter) => {
    try {
      await createCostCenter(values)
      const idNot = toast.loading(
        'Creando centro de costo ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Centro de costo creado',
        ...NOTIFICATION.updateLoading,
      })
      setCostCenter(null)
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
        const response = await sdk.getAccount()

        setCashAccount(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTyeCategory()
  }, [])

  return (
    <Form
      form={form}
      name="createCostCenter"
      onFinish={onFinish}
      labelCol={{ span: 11 }}
      wrapperCol={{ span: 150 }}
    >
      <Form.Item
        name="origin"
        label="Centro de costo"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el origen del Centro de Costos',
          },
          {
            max: 150,
            message: 'El Origen debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="account_caja" label="Cuenta de tienda">
        <Select>
          {cashAccount
            .filter((tipoCategory) => String(tipoCategory.id).startsWith('102'))
            .map((tipoCategory) => (
              <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
                {tipoCategory.account}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item name="account_ajuste" label="Cuenta de ajuste">
        <Select>
          {cashAccount
            .filter((tipoCategory) => String(tipoCategory.id).startsWith('103'))
            .map((tipoCategory) => (
              <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
                {tipoCategory.account}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item name="account_merca" label="Cuenta de mercadería">
        <Select>
          {cashAccount
            .filter((tipoCategory) => String(tipoCategory.id).startsWith('106'))
            .map((tipoCategory) => (
              <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
                {tipoCategory.account}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item name="is_cash" label="¿Es tienda?">
        <Select>
          <Option key={CostCenterIs_cash.Si} value={CostCenterIs_cash.Si}>
            Si
          </Option>
          <Option key={CostCenterIs_cash.No} value={CostCenterIs_cash.No}>
            No
          </Option>
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={CostCenterStatus.Active}>
          <Option key={CostCenterStatus.Active} value={CostCenterStatus.Active}>
            Activo
          </Option>
          <Option
            key={CostCenterStatus.Inactive}
            value={CostCenterStatus.Inactive}
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
