import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { ITEM } from '@/const/localStorageItems'
import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import {
  createBalance,
  createCashAccount,
  nameIamCash,
} from '@/data/cashAccount/sdk'
import {
  ICashAccount,
  ICreateCashAccount,
} from '@/data/cashAccount/types/cashAccount'
import { ITypeCashAccount } from '@/data/cashAccount/types/cashTypes'
import { CashAccountStatus } from '@/data/cashAccount/types/status'
import { Account } from '@/data/types'

const { Option } = Select
export const CreateFormCash: React.FC<{
  cashAccount: ICreateCashAccount | null
  setCashAccount: Dispatch<SetStateAction<ICashAccount | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setCashAccount, onClose, reload }) => {
  const [form] = Form.useForm()
  const [date] = useState(new Date())
  const formattedDate = date.toISOString().split('T')[0]

  const [account, setAccount] = useState<Account[]>([])
  const [typeAccount, setTypeAccount] = useState<ITypeCashAccount[]>([])
  const onFinish = async (values: ICreateCashAccount) => {
    try {
      const formValues = form.getFieldsValue()

      await createCashAccount(values)
      const data: any = await nameIamCash(String(values.name))
      const id = data[0].id

      const storedData = localStorage.getItem(ITEM.USER_BASIC_INFO)
      if (storedData) {
        await createBalance(
          id,
          formValues.monto,
          formValues.fecha,
          JSON.parse(storedData).name,
        )
        form.resetFields()
      }

      const idNot = toast.loading(
        'Creando caja de cuenta ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Caja de cuenta creada',
        ...NOTIFICATION.updateLoading,
      })

      setCashAccount(null)
      form.resetFields()
      reload()
      onClose()
      console.log()
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
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre de la Cuenta de Efectivo',
          },
          {
            max: 150,
            message: 'El nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="account_id" label="Cuenta contable">
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

      <Form.Item name="type_cash_id" label="Tipo de caja">
        <Select>
          {typeAccount.map((typeAccount) => (
            <Select.Option key={typeAccount.id} value={typeAccount.id}>
              {typeAccount.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="monto"
        label="Monto"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa un monto válido',
          },
        ]}
      >
        <InputNumber
          step={0.01}
          min={0.01}
          prefix="S/ "
          precision={2}
          placeholder="1.00"
          className="w-36"
        />
      </Form.Item>
      <Form.Item
        name="fecha"
        label="Fecha"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa un fecha',
          },
        ]}
      >
        <DatePicker allowClear={false} value={dayjs(formattedDate)} />
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={CashAccountStatus.Active}>
          <Option
            key={CashAccountStatus.Active}
            value={CashAccountStatus.Active}
          >
            Activo
          </Option>
          <Option
            key={CashAccountStatus.Inactive}
            value={CashAccountStatus.Inactive}
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
