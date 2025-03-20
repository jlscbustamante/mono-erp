import { Button, Drawer, Form, Input, Select } from 'antd'
import Search from 'antd/es/input/Search'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
// import { createSupplier } from '@/data/maintenance/Supplier/sdk'
import { createSupplier } from '@/data/products/sdk'
import { IInvSupplier } from '@/data/products/types'
import * as sdkRequest from '@/data/requests/sdk'

export const CreateProviderDrawer = ({
  open,
  onClose,
  onCreate,
  suppliers,
}: {
  open: boolean
  onClose: () => void
  onCreate?: () => void
  suppliers: IInvSupplier[]
}) => {
  const [loadingRuc, setLoadingRuc] = useState(false)
  const [form] = Form.useForm()
  const names: Record<keyof IInvSupplier, string> = {
    address: 'address',
    id: 'id',
    legalAccountBco: 'legalAccountBco',
    legalAccountCci: 'legalAccountCci',
    legalAccountCur: 'legalAccountCur',
    legalAccountNum: 'legalAccountNum',
    legalAccountType: 'legalAccountType',
    legalName: 'legalName',
    legalNumber: 'legalNumber',
    supplier: 'supplier',
    status: 'status',
  }

  const handleSearchRuc = async (ruc: string) => {
    try {
      if (ruc.length === 0) return
      setLoadingRuc(true)
      const { name } = await sdkRequest.getNameByRuc(ruc)
      form.setFieldValue(names.legalName, name)
      form.validateFields([names.legalName])
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setLoadingRuc(false)
    }
  }
  // const [availableButton, setAvailableButton] = useState(false)

  const handleCreate = async (values: IInvSupplier) => {
    try {
      await createSupplier(values)
      const idNot = toast.loading('Creando proveedor ...', NOTIFICATION.loading)
      toast.update(idNot, {
        render: 'Proveedor creado',
        ...NOTIFICATION.updateLoading,
      })
      form.resetFields()
      onCreate?.()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Drawer
      title="Crear Proveedor"
      keyboard={false}
      width={500}
      open={open}
      onClose={onClose}
    >
      <Form
        form={form}
        name="createSupplier"
        labelCol={{ span: 10 }}
        // onChange={() => {
        //   const { legal_number, legal_name, supplier } = form.getFieldsValue()
        //   setAvailableButton(legal_number && legal_name && supplier)
        // }}
        onFinish={handleCreate}
        wrapperCol={{ span: 90 }}
      >
        <Form.Item
          name={names.legalNumber}
          label="RUC"
          rules={[
            () => ({
              validator(_, value, callback) {
                const isUnique = suppliers.some(
                  (el: any) =>
                    el.legalNumber?.toString().toLowerCase() ===
                    value.toString().toLowerCase(),
                )
                if (isUnique) {
                  callback('El ruc ya existe')
                } else callback()
              },
            }),
          ]}
        >
          <Search
            placeholder="000000000000"
            onSearch={(ruc) => {
              handleSearchRuc(ruc)
            }}
            onChange={() => {
              // form.setFieldValue(names.legalName, '')
            }}
            loading={loadingRuc}
          />
        </Form.Item>
        <Form.Item
          name={names.legalName}
          label="Razón Social"
          rules={[
            {
              max: 150,
              message: 'El proveedor debe tener como máximo 150 caracteres',
            },
          ]}
        >
          <Input placeholder="Ingresa el RUC" />
        </Form.Item>
        <Form.Item
          name={names.supplier}
          label="Nombre"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el nombre',
            },
            {
              max: 150,
              message: 'El nombre debe tener como máximo 150 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.address}
          label="Direccion"
          rules={[
            {
              max: 250,
              message: 'La direccion debe tener como máximo 250 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.legalAccountBco}
          label="Banco"
          rules={[
            {
              max: 15,
              message: 'El banco debe tener como máximo 15 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.legalAccountNum}
          label="Número de cuenta"
          rules={[
            {
              max: 15,
              message:
                'El numero de cuenta debe tener como máximo 15 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.legalAccountCci}
          label="Número de cuenta CCI"
          rules={[
            {
              max: 15,
              message:
                'El numero de cuenta CCI debe tener como máximo 15 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.legalAccountCur}
          label="Moneda"
          rules={[
            {
              max: 5,
              message: 'La moneda debe tener como máximo 5 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={names.legalAccountType}
          label="Tipo de cuenta"
          rules={[
            {
              max: 15,
              message: 'El tipo de cuenta debe tener como máximo 15 caracteres',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={names.status} label="Estado" initialValue={1}>
          <Select>
            <Select.Option value={1}>Activo</Select.Option>
            <Select.Option value={0}>Inactivo</Select.Option>
          </Select>
        </Form.Item>

        {/* <Form.Item className="text-right"> */}
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </div>
        {/* </Form.Item> */}
      </Form>
    </Drawer>
  )
}
