import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { viewClient } from '@/lib/rpc'
import { CompanySelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { AdmReqContractSelect } from '@types'
import {
  Button,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type R = keyof AdmReqContractSelect
// This function is used to get the key of the AdmReqContractSelect type
const gk = (key: R): string => {
  return key
}

export function Contrato({ contract_id }: { contract_id: number }) {
  const query = useQuery({
    queryKey: ['rq:contract_get_one', contract_id],
    queryFn: async () => {
      const data = await viewClient.api.view.payment.contract.list[
        ':contract_id'
      ].$get({
        param: {
          contract_id: contract_id.toString(),
        },
      })
      const result = await data.json()
      if (!data.ok) {
        throw new Error(result.message)
      }
      return result.data as AdmReqContractSelect
    },
  })
  const [form_instance] = Form.useForm<AdmReqContractSelect>()
  const [quotas, set_quotas] = useState(1)

  useEffect(() => {
    if (query.data) {
      form_instance.setFieldsValue({
        ...query.data,
      })
      set_quotas(query.data.quotas ?? 1)
    } else {
      form_instance.resetFields()
      set_quotas(1)
    }
  }, [query.data])

  return (
    <div className="grid gap-1 grid-cols-2">
      <DatosPrincipales form_instance={form_instance} />
      <FormaPago
        form_instance={form_instance}
        quotas={quotas}
        set_quotas={set_quotas}
      />
      <TerminosPago form_instance={form_instance} />
    </div>
  )
}

const DatosPrincipales = ({
  form_instance,
}: {
  form_instance: FormInstance<AdmReqContractSelect>
}) => {
  const { data: companies } = useQuery({
    queryKey: ['rq:companies'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
    },
  })

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form_instance}
        disabled={true}
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Empresa" className="mb-1" name={gk('company_id')}>
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
              <Input placeholder="RUC proveedor" />
            </Form.Item>
          </div>
          <Form.Item
            className="mb-1"
            label="Proveedor"
            name={gk('legal_name')}
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
            name={gk('description')}
          >
            <Input.TextArea placeholder="..." rows={1} />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

const TerminosPago = ({
  form_instance,
}: {
  form_instance: FormInstance<AdmReqContractSelect>
}) => {
  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Terminos de pago
      </h3>
      <Form
        disabled={true}
        form={form_instance}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
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
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
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
      </Form>
    </div>
  )
}

const FormaPago = ({
  form_instance,
  quotas,
  set_quotas,
}: {
  form_instance: FormInstance<AdmReqContractSelect>
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
                  readOnly
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
