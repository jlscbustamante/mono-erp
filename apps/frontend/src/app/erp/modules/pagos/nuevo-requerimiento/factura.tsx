import { CustomCheckbox } from '@/components/ant-form/custom-checkbox'
import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CreateSupplier } from '@/views/products/components/productItem/CreateSupplier'
import {
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AdmRequirementInsert, InvSupplierSelect } from '@types'
import { REQUIREMENT_TYPE_DOCUMENT } from '@view'
import {
  AutoComplete,
  AutoCompleteProps,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { useState } from 'react'

type R = keyof AdmRequirementInsert

export function CrearFactura() {
  // const [formPrincipal] = Form.useForm()
  // const [formCategoria] = Form.useForm()
  const [form_instance] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const createRequirementMt = useMutation({
    mutationFn: async (data: AdmRequirementInsert) => {
      const request =
        await viewClient.api.view.payment.create_requirement.$post({
          json: data,
        })
      if (!request.ok) {
        const error = await request.json()
        throw new Error(error.message)
      }
    },
    onError: (error) => {
      messageApi.error(error.message)
    },
    onSuccess: () => {
      messageApi.success('Requerimiento creado correctamente')
      form_instance.resetFields()
    },
  })

  const onSave = async () => {
    const pricipales = form_instance.getFieldsValue()

    const value: AdmRequirementInsert = {
      ...pricipales,
    }
    await createRequirementMt.mutateAsync(value)
  }

  return (
    <div className="grid gap-1 grid-cols-2">
      {contextHolder}
      <DatosPrincipales
        formInstance={form_instance}
        messageInstance={messageApi}
      />
      <DatosProveedor formInstance={form_instance} />
      <CategoriaGasto
        onSave={onSave}
        formInstance={form_instance}
        loading={createRequirementMt.isPending}
      />
    </div>
  )
}

const DatosPrincipales = ({
  formInstance,
  messageInstance,
}: {
  formInstance: FormInstance<any>
  messageInstance?: MessageInstance
}) => {
  const [options_suppliers, set_options_suppliers] = useState<
    AutoCompleteProps['options']
  >([])
  const { data: companies } = useQuery({
    queryKey: ['rq:companies'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
    },
  })

  const { data: suppliers, refetch: _refetchSupplier } = useQuery({
    queryKey: ['rq:suppliers'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
    },
  })

  const searchSupplier = (ruc: string) => {
    const supplier = suppliers?.find((el) => el.legal_number === ruc)
    if (supplier) {
      formInstance.setFieldValue('legal_name' satisfies R, supplier.legal_name)
      formInstance.setFieldValue(
        'legal_number' satisfies R,
        supplier.legal_number,
      )
      formInstance.setFieldValue('supplier_id' satisfies R, supplier.id)
    } else {
      formInstance.setFieldValue('legal_name' satisfies R, undefined)
      formInstance.setFieldValue('legal_number' satisfies R, undefined)
      formInstance.setFieldValue('supplier_id' satisfies R, undefined)
      messageInstance?.warning('Proveedor no encontrado')
    }
  }

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={formInstance}
        name="formPrincipal"
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies R}
          >
            <Select placeholder="Empresa">
              {companies?.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Form.Item
              label="RUC proveedor"
              className="mb-1 flex-1"
              rules={[{ required: true }]}
              name={'legal_number' satisfies R}
            >
              <AutoComplete
                showSearch
                options={options_suppliers}
                onSearch={(text) => {
                  if (!text) {
                    set_options_suppliers([])
                    return
                  }
                  const hast_letters = /[a-zA-Z]/.test(text)
                  if (hast_letters) {
                    const filtered = suppliers?.filter((el) => {
                      return (
                        el.legal_name
                          ?.toLowerCase()
                          .includes(text.toLowerCase()) ?? false
                      )
                    })
                    set_options_suppliers(
                      filtered?.map((el) => ({
                        value: el.legal_number,
                      })) ?? [],
                    )
                  } else {
                    const filtered = suppliers?.filter((el) => {
                      return (
                        el.legal_number
                          ?.toLowerCase()
                          .includes(text.toLowerCase()) ?? false
                      )
                    })
                    set_options_suppliers(
                      filtered?.map((el) => ({
                        value: el.legal_number,
                      })) ?? [],
                    )
                  }
                }}
                onSelect={() => {
                  set_options_suppliers([])
                }}
              >
                <Input.Search
                  placeholder="RUC proveedor"
                  className="!w-[calc(100%_-_2rem)]"
                  onSearch={(ruc) => {
                    searchSupplier(ruc)
                  }}
                />
              </AutoComplete>
            </Form.Item>
            <CreateSupplier
              className="absolute top-0 right-0"
              suppliers={suppliers ?? []}
              onError={(message) => {
                messageInstance?.error(message)
              }}
              onCreate={(id, supplier, ruc) => {
                formInstance.setFieldValue('supplier_id' satisfies R, id)
                formInstance.setFieldValue('legal_name' satisfies R, supplier)
                formInstance.setFieldValue('legal_number' satisfies R, ruc)
              }}
            />
          </div>

          <Form.Item
            className="mb-1"
            label="Proveedor"
            name={'legal_name' satisfies R}
            rules={[{ required: true }]}
          >
            <Input placeholder="Proveedor" className="" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Detalle"
            className="col-span-2 mb-1"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 21 }}
            name={'description' satisfies R}
          >
            <Input.TextArea placeholder="..." rows={1} />
          </Form.Item>
        </div>
        <Form.Item hidden name="supplier_id">
          <Input />
        </Form.Item>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Tipo doc"
            className="mb-1"
            name={'type_document' satisfies R}
          >
            <Select placeholder="Requerimiento" filterOption={filterSelectForm}>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.FACTURA}>
                Factura
              </Select.Option>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.BOLETA}>
                Boleta
              </Select.Option>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.TICKET_SALIDA}>
                Ticket salida
              </Select.Option>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.NOTA_CREDITO}>
                Nota credito
              </Select.Option>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.NOTA_DEBITO}>
                Factura
              </Select.Option>
              <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.GUIA_REMISION}>
                Guia remision
              </Select.Option>
              <Select.Option
                value={REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA}
              >
                Guia transportista
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="N° doc"
            className="mb-1"
            name={'num_document' satisfies R}
          >
            <Input placeholder="N° doc" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Contrato">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

const CategoriaGasto = ({
  onSave,
  formInstance,
  loading,
}: {
  loading: boolean
  onSave: () => void
  formInstance: FormInstance<any>
}) => {
  const { data: movesCash } = useQuery({
    queryKey: ['rq:moveCash'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.movescash.$get()
      const result = await request.json()
      return result.data as MoveCashSelect[]
    },
  })

  const { data: costCenters } = useQuery({
    queryKey: ['rq:costCenters'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.costCenters.$get()
      const result = await request.json()
      return result.data as CostCenterSelecet[]
    },
  })

  const hasRetention = Form.useWatch('has_retention', formInstance)

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Categoría de gasto
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={formInstance}
        name="formCategoria"
        onFinish={onSave}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Monto"
            className="mb-1"
            name={'amount' satisfies R}
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1" name={'money' satisfies R}>
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Vencimiento"
            className="mb-1"
            rules={[{ required: true }]}
            name={'expires_at' satisfies R}
          >
            <CustomDatePicker />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Tiene retencion"
            className="mb-1"
            name={'has_retention' satisfies R}
          >
            <CustomCheckbox />
          </Form.Item>
          <Form.Item
            label="Retencion"
            className="mb-1"
            name={'amount_ret' satisfies R}
          >
            <Input placeholder="0.00" disabled={!(hasRetention == '1')} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Categoria" name={'movetype_id' satisfies R}>
            <Select
              placeholder="Categorias"
              showSearch
              filterOption={filterSelectForm}
            >
              {movesCash?.map((moveCash) => (
                <Select.Option key={moveCash.id} value={moveCash.id}>
                  {moveCash.movetype}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Centro de costo" name={'costcenter_id' satisfies R}>
            <Select
              placeholder="Centro de costo"
              showSearch
              filterOption={filterSelectForm}
            >
              {costCenters?.map((costCenter) => (
                <Select.Option key={costCenter.id} value={costCenter.id}>
                  {costCenter.costcenter}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const DatosProveedor = ({
  formInstance,
}: {
  formInstance: FormInstance<any>
}) => {
  const supplier_id = Form.useWatch('supplier_id', formInstance) as
    | number
    | undefined

  const { data: supplier } = useQuery({
    queryKey: ['rq:supplier_one', supplier_id],
    enabled: !!supplier_id,
    gcTime: 0,
    queryFn: async () => {
      const data = await viewClient.api.view.supplier.get_one[':id'].$get({
        param: { id: supplier_id!.toString() },
      })
      const result = await data.json()
      if (!data.ok) {
        throw new Error(result.message)
      }
      return result.data as InvSupplierSelect
    },
  })

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos del proveedor
      </h3>
      <div className="ml-10 flex flex-col gap-2">
        <div className="grid grid-cols-2">
          <p>Proveedor: {supplier?.legal_name}</p>
          <p>RUC: {supplier?.legal_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <span>Cuenta: {supplier?.bank_account_num}</span>
        </div>
        <div>
          <p>CCI: {supplier?.bank_account_cci}</p>
        </div>
        <div>
          <p>Tipo: Cuenta corriente</p>
        </div>
        <div>
          <p>Banco : {supplier?.bank_code}</p>
        </div>
      </div>
    </div>
  )
}
