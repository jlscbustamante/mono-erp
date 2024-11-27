import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import { updateCashAccount } from '@/data/cashAccount/sdk'
import {
  ICashAccount,
  ICreateCashAccount,
} from '@/data/cashAccount/types/cashAccount'
import { ITypeCashAccount } from '@/data/cashAccount/types/cashTypes'
import { CashAccountStatus } from '@/data/cashAccount/types/status'
import { Account } from '@/data/types'

export const UpdateFormCash: React.FC<{
  cashAccount: ICreateCashAccount | null
  setCashAccount: Dispatch<SetStateAction<ICashAccount | null>>
  onClose: () => void
  reload: () => void
}> = ({ cashAccount, setCashAccount, onClose, reload }) => {
  const [form] = Form.useForm()
  const [account, setAccount] = useState<Account[]>([])
  const [typeAccount, setTypeAccount] = useState<ITypeCashAccount[]>([])
  const onFinish = async (values: ICashAccount) => {
    try {
      await updateCashAccount(cashAccount?.id, values)
      const idNot = toast.loading(
        'Actualizando caja de cuenta ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Caja de cuenta actualizada',
        ...NOTIFICATION.updateLoading,
      })
      setCashAccount(null)
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
        const type = await sdk.getTypeCashAccount()
        setTypeAccount(type)
        setAccount(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTyeCategory()
  }, [])

  return (
    <Form
      form={form}
      name="updateCashAccount"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={cashAccount ? cashAccount.id : ''}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="name"
        label="Nombre"
        initialValue={cashAccount ? cashAccount.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre de la Cuenta de Efectivo',
          },
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={cashAccount ? cashAccount.account_id : ''}
        name="account_id"
        label="Cuenta contable"
      >
        <Select>
          {account
            .filter((tipoCategory) => String(tipoCategory.id).startsWith('102'))
            .map((tipoCategory) => (
              <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
                {tipoCategory.account}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        initialValue={cashAccount ? cashAccount.type_cash_id : ''}
        name="type_cash_id"
        label="Tipo de caja"
      >
        <Select>
          {typeAccount.map((typeAccount) => (
            <Select.Option key={typeAccount.id} value={typeAccount.id}>
              {typeAccount.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Estado"
        initialValue={cashAccount ? cashAccount.status : ''}
      >
        <Select>
          <Select.Option
            key={CashAccountStatus.Active}
            value={CashAccountStatus.Active}
          >
            Activo
          </Select.Option>
          <Select.Option
            key={CashAccountStatus.Inactive}
            value={CashAccountStatus.Inactive}
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
