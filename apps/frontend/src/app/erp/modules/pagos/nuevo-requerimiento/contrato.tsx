import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { viewClient } from '@/lib/rpc'
import { CreateSupplier } from '@/views/products/components/productItem/CreateSupplier'
import { CompanySelect, SupplierSelect } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AdmReqContractInsert } from '@types'
import {
  AutoComplete,
  AutoCompleteProps,
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

type R = keyof AdmReqContractInsert
// This function is used to get the key of the AdmReqContractSelect type
const gk = (key: R): string => {
  return key
}

export function Contrato() {
  const [form_instance] = Form.useForm<AdmReqContractInsert>()
  const [message_api, context_holder] = message.useMessage()
  const [quotas, set_quotas] = useState(1)

  const create_contract_mt = useMutation({
    mutationFn: async (values: AdmReqContractInsert) => {
      const req = await viewClient.api.view.payment.contract.create.$post({
        json: values,
      })

      if (!req.ok) {
        const error = await req.json()
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      form_instance.resetFields()
      message_api.success('Contrato creado correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        autoClose: false,
      })
    },
  })

  const handle_submit = (values: AdmReqContractInsert) => {
    const new_contract: AdmReqContractInsert = {
      ...values,
      quotas: quotas,
    }
    create_contract_mt.mutate(new_contract)
  }

  return (
    <div className="grid gap-1 grid-cols-2">
      {context_holder}
      <DatosPrincipales
        form_instance={form_instance}
        message_api={message_api}
      />
      <FormaPago
        form_instance={form_instance}
        quotas={quotas}
        set_quotas={set_quotas}
      />
      <TerminosPago
        form_instance={form_instance}
        handle_submit={handle_submit}
      />
    </div>
  )
}

const DatosPrincipales = ({
  form_instance,
  message_api,
}: {
  form_instance: FormInstance<AdmReqContractInsert>
  message_api: MessageInstance
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
      form_instance.setFieldValue('legal_name', supplier.legal_name)
      form_instance.setFieldValue('supplier_id', supplier.id)
    } else {
      form_instance.setFieldValue('legal_name', undefined)
      form_instance.setFieldValue('supplier_id', undefined)
      message_api.error('Proveedor no encontrado')
    }
  }

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        form={form_instance}
        onFinish={(values) => {
          console.log(values)
        }}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Empresa" className="mb-1" name={gk('company_id')}>
            <Select placeholder="Empresa">
              {companies?.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.razon_social}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Tipo de contrato"
            className="mb-1"
            rules={[{ required: true }]}
            name={gk('contract_type')}
          >
            <Select>
              <Select.Option value="1">Contrato</Select.Option>
              <Select.Option value="2">Adenda</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="N° Pizza Raul"
            className="mb-1"
            name={gk('contract_code')}
          >
            <Input disabled={true} placeholder="Autogenerado" />
          </Form.Item>
          <Form.Item
            label="N° Proveedor"
            className="mb-1"
            name={gk('supplier_code')}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Form.Item
              label="RUC proveedor"
              className="mb-1 flex-1"
              rules={[{ required: true }]}
              name={gk('legal_number')}
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
                message_api?.error(message)
              }}
              onCreate={(id, supplier, ruc) => {
                form_instance.setFieldValue('supplier_id', id)
                form_instance.setFieldValue('legal_name', supplier)
                form_instance.setFieldValue('legal_number', ruc)
              }}
            />
          </div>
          <Form.Item
            className="mb-1"
            label="Proveedor"
            name={gk('legal_name')}
            rules={[{ required: true }]}
          >
            <Input placeholder="Proveedor" className="" readOnly />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Detalle"
            className="col-span-2 mb-1"
            labelCol={{
              offset: 2,
              // span: 3,
            }}
            wrapperCol={{ span: 21 }}
            name={gk('description')}
          >
            <Input.TextArea placeholder="..." rows={1} className="-ml-1" />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

const TerminosPago = ({
  form_instance,
  handle_submit,
}: {
  form_instance: FormInstance<AdmReqContractInsert>
  handle_submit: (values: AdmReqContractInsert) => void
}) => {
  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Terminos de pago
      </h3>
      <Form
        form={form_instance}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handle_submit}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Monto"
            className="mb-1"
            name={gk('amount')}
            rules={[{ required: true }]}
          >
            <InputNumber className="w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1" name={gk('money')}>
            <Select placeholder="Moneda">
              <Select.Option value="PEN">PEN</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            name={gk('pay_method')}
            label="Forma de pago"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={'CONTADO'}>CONTADO</Select.Option>
              <Select.Option value={'CREDITO'}>CREDITO</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Frecuencia de pago"
            className="mb-1"
            name={gk('pay_frequency')}
          >
            <Select>
              <Select.Option value="MENSUAL">Mensual</Select.Option>
              <Select.Option value="QUINCENAL">Quincenal</Select.Option>
              <Select.Option value="SEMANAL">Semanal</Select.Option>
              <Select.Option value="UNICO">Unico</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item className="mb-1" label="Vigencia" name={gk('validity')}>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Inicio" className="mb-1" name={gk('effective_at')}>
            {/* <DatePicker className="w-full" /> */}
            <CustomDatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Vencimiento"
            className="mb-1"
            name={gk('expires_at')}
          >
            {/* <DatePicker className="w-full" /> */}
            <CustomDatePicker className="w-full" />
          </Form.Item>
        </div>
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const FormaPago = ({
  form_instance,
  quotas,
  set_quotas,
}: {
  form_instance: FormInstance<AdmReqContractInsert>
  quotas: number
  set_quotas: React.Dispatch<React.SetStateAction<number>>
}) => {
  const amount = Form.useWatch(gk('amount'), form_instance)
  const pay_method = Form.useWatch(gk('pay_method'), form_instance)

  const quotas_available = useMemo((): boolean => {
    return pay_method === 'CREDITO'
  }, [pay_method])

  const amounts_by_quotas = useMemo((): {
    amount: number
  }[] => {
    if (!amount) {
      return Array(quotas).fill({ amount: 0 })
    }

    const quotaAmount = Number(amount) / quotas
    return Array(quotas).fill({ amount: quotaAmount })
  }, [amount, quotas])

  useEffect(() => {
    set_quotas(1)
  }, [pay_method])

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Forma de pago
      </h3>
      <div className="ml-10 flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="grid grid-cols-[200px_200px] gap-2">
            <p>N° cuota</p>
            <div className="space-y-2">
              <Input className="w-20" value={quotas} readOnly />
              <div className="flex gap-1 items-center">
                <Button
                  size="small"
                  disabled={!quotas_available}
                  onClick={() => {
                    set_quotas((prev: number) => {
                      const newQuota = prev + 1
                      return newQuota
                    })
                  }}
                  type="primary"
                >
                  <Plus className="w-4 text-white" />
                </Button>
                <Button
                  size="small"
                  disabled={!quotas_available || quotas <= 1}
                  // onClick={() => changeQuota(false)}
                  onClick={() => {
                    set_quotas((prev: number) => {
                      if (prev <= 1) {
                        return 1
                      }
                      const newQuota = prev - 1
                      return newQuota
                    })
                  }}
                  type="primary"
                >
                  <Minus className="w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {amounts_by_quotas.map((data, index) => (
              <div className="flex gap-1" key={index + 1}>
                <Input className="w-20" value={index + 1} />
                <InputNumber
                  className="w-28"
                  value={data.amount}
                  precision={2}
                />
                <DatePicker className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
