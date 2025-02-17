import { Button, Drawer, Form, Input, Select } from 'antd'
import Search from 'antd/es/input/Search'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { NOTIFICATION } from '@/const/notification'
import { ISupplier } from '@/data/maintenance/Supplier/type/Supplier'
import { supplierEdit } from '@/data/products/sdk'
import { IInvSupplier } from '@/data/products/types'
import * as sdkRequest from '@/data/requests/sdk'

const providerForEditAtom = atom<ISupplier | undefined>({
  key: 'providerForEditproducts',
  default: undefined,
})

export const useProviderDrawer = () => {
  const [supplier, setSupplier] = useRecoilState(providerForEditAtom)

  const onOpen = (supp: ISupplier) => {
    setSupplier(supp)
  }
  const onClose = () => {
    setSupplier(undefined)
  }

  const isOpen = useMemo(() => {
    return !!supplier
  }, [supplier])

  return {
    onOpen,
    supplier,
    onClose,
    isOpen,
  }
}

export const EditProviderDrawer = ({ onUpdate }: { onUpdate?: () => void }) => {
  const [loadingRuc, setLoadingRuc] = useState(false)
  const [form] = Form.useForm()
  const { isOpen, onClose, supplier } = useProviderDrawer()
  const [loading, setLoading] = useState(false)

  const handleSearchRuc = async (ruc: string) => {
    try {
      if (ruc.length === 0) return
      setLoadingRuc(true)
      const { name } = await sdkRequest.getNameByRuc(ruc)
      form.setFieldValue('legal_name', name)
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setLoadingRuc(false)
    }
  }

  const handleUpdate = async (supplierUp: IInvSupplier) => {
    if (!supplier) return
    try {
      setLoading(true)
      // await updateSupplier(supplier.id.toString(), supplierUp)
      await supplierEdit({ ...supplierUp, id: supplier.id })
      onUpdate?.()
      onClose()
      form.resetFields()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier)
    } else {
      form.resetFields()
      onClose()
    }
  }, [supplier])

  return (
    <Drawer
      title="Editar Proveedor"
      keyboard={false}
      width={500}
      open={isOpen}
      onClose={onClose}
    >
      <Form
        form={form}
        name="updateSupplier"
        labelCol={{ span: 10 }}
        onFinish={handleUpdate}
        wrapperCol={{ span: 90 }}
      >
        <Form.Item
          name="legalNumber"
          label="RUC"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el ruc',
            },
          ]}
        >
          <Search
            placeholder="000000000000"
            onSearch={(ruc) => {
              handleSearchRuc(ruc)
            }}
            loading={loadingRuc}
          />
        </Form.Item>
        <Form.Item
          name="legalName"
          label="Razón Social"
          rules={[
            {
              required: true,
              message: 'Por favor, ingresa el proveedor',
            },
            {
              max: 150,
              message: 'El proveedor debe tener como máximo 150 caracteres',
            },
          ]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="supplier"
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
          name="address"
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
          name="legalAccountBco"
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
          name="legalAccountNum"
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
          name="legalAccountCci"
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
          name="legalAccountCur"
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
          name="legalAccountType"
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

        <Form.Item name="status" label="Estado" initialValue={1}>
          <Select>
            <Select.Option value={1}>Activo</Select.Option>
            <Select.Option value={0}>Inactivo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
