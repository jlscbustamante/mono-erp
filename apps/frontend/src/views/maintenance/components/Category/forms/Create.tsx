import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import { getAccountFather } from '@/data/cashAccount/sdk'
import { createCategory, getTypeCategory } from '@/data/category/sdk'
import {
  CategoryStatus,
  ICategory,
  ICreateCategory,
  ITypeCategory,
} from '@/data/category/types'
import { CategoryFlow } from '@/data/category/types/flow'
import { CategoryMov } from '@/data/category/types/mov'
import { Account } from '@/data/types'

const { Option } = Select

export const CreateForm: React.FC<{
  category: ICreateCategory | null
  setCategory: Dispatch<SetStateAction<ICategory | null>>
  onClose: () => void
  reload: () => void
  showUnsign?: boolean
}> = ({ setCategory, onClose, reload }) => {
  const [form] = Form.useForm()
  const [account, setAccount] = useState<Account[]>([])
  const [tipoCategory, setTipoCategory] = useState<ITypeCategory[]>([])
  const onFinish = async (values: ICreateCategory) => {
    try {
      await createCategory(values)

      const idNot = toast.loading('Creando categoría ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Categoría creada',
        ...NOTIFICATION.updateLoading,
      })
      setCategory(null)
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
        const response = await getTypeCategory()
        const accounts = await sdk.getAccount()
        setAccount(accounts)
        setTipoCategory(response)
        console.log(tipoCategory)
      } catch (error) {
        console.log(error)
      }
    }

    fetchTyeCategory()
  }, [])
  const handleTypeCategoryChange = async (value: string) => {
    if (Number(value) == 7) {
      form.setFieldsValue({
        account_id: undefined,
      })
      const response = await getAccountFather()
      setAccount(response)
    } else {
      const accounts = await sdk.getAccount()
      setAccount(accounts)
      form.setFieldsValue({
        account_id: undefined,
      })
    }
  }
  return (
    <Form
      form={form}
      name="createCategory"
      onFinish={onFinish}
      labelCol={{ span: 9 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre de la Categoria',
          },
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="account_id" label="Cuenta contable">
        <Select>
          {account.map((tipoCategory) => (
            <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
              {tipoCategory.account}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="type_category_id" label="Tipo de categoria">
        <Select onChange={handleTypeCategoryChange}>
          {tipoCategory.map((tipoCategory) => (
            <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
              {tipoCategory.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="account_flow" label="Flujo contable">
        <Select>
          <Option key={CategoryFlow.Ingreso}>Ingreso</Option>
          <Option key={CategoryFlow.Salida}>Salida</Option>
        </Select>
      </Form.Item>

      <Form.Item name="type_mov" label="Tipo de movimiento">
        <Select>
          <Option key={CategoryMov.Venta}>Venta</Option>
          <Option key={CategoryMov.Gasto}>Gasto</Option>
        </Select>
      </Form.Item>

      <Form.Item name="status" label="Estado">
        <Select defaultValue={CategoryStatus.Active}>
          <Option key={CategoryStatus.Active}>Activo</Option>
          <Option key={CategoryStatus.Inactive}>Inactivo</Option>
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
