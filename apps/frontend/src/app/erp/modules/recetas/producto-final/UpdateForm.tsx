import { Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/cashAccount/sdk'
import { getTypeCategory, updateCategory } from '@/data/category/sdk'
import {
  CategoryStatus,
  ICategory,
  ICreateCategory,
  ITypeCategory,
} from '@/data/category/types'
import { CategoryFlow } from '@/data/category/types/flow'
import { CategoryMov } from '@/data/category/types/mov'
import { Account } from '@/data/types'

export const UpdateForm: React.FC<{
  category: ICreateCategory | null
  setCategory: Dispatch<SetStateAction<ICategory | null>>
  onClose: () => void
  reload: () => void
}> = ({ setCategory, category, onClose, reload }) => {
  const [form] = Form.useForm()
  const [tipoCategory, setTipoCategory] = useState<ITypeCategory[]>([])
  const [account, setAccount] = useState<Account[]>([])
  const onFinish = async (values: ICategory) => {
    try {
      await updateCategory(category?.id, values)
      const idNot = toast.loading(
        'Actualizando categoría ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Categoría actualizada',
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
      } catch (error) {
        console.log(error)
      }
    }

    fetchTyeCategory()
  }, [])

  const handleTypeCategoryChange = (value: string) => {
    // Check if the selected value is "Multiple"
    if (Number(value) == 7) {
      console.log('Selected type of category is Multiple')
    }
  }

  return (
    <Form
      form={form}
      name="updateCategory"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={category ? category.id : ''}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="name"
        label="Nombre"
        initialValue={category ? category.name : ''}
        rules={[
          {
            required: true,
            message: 'Por favor, ingresa el nombre de la Categoria',
          },
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracter',
          },
        ]}
      >
        <Input maxLength={150} />
      </Form.Item>
      <Form.Item
        name="account_id"
        label="Cuenta contable"
        initialValue={category ? category.account_id : ''}
      >
        <Select>
          {account.map((tipoCategory) => (
            <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
              {tipoCategory.account}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        initialValue={category ? category.type_category_id : ''}
        name="type_category_id"
        label="Tipo de categoria"
      >
        <Select onChange={handleTypeCategoryChange}>
          {tipoCategory.map((tipoCategory) => (
            <Select.Option key={tipoCategory.id} value={tipoCategory.id}>
              {tipoCategory.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="account_flow"
        label="Flujo contable"
        initialValue={category ? category.account_flow : ''}
      >
        <Select>
          <Select.Option key={CategoryFlow.Ingreso}>Ingreso</Select.Option>
          <Select.Option key={CategoryFlow.Salida}>Salida</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="type_mov"
        label="Tipo de movimiento"
        initialValue={category ? category.type_mov : ''}
      >
        <Select>
          <Select.Option key={CategoryMov.Gasto}>Gasto</Select.Option>
          <Select.Option key={CategoryMov.Venta}>Venta</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="status"
        label="Estado"
        initialValue={category ? category.status : ''}
      >
        <Select>
          <Select.Option key={CategoryStatus.Active}>Activo</Select.Option>
          <Select.Option key={CategoryStatus.Inactive}>Inactivo</Select.Option>
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
