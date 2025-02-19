import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import {
  CashBankSelect,
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CreateRequirementDto, REQUIREMENT_TYPE_DOCUMENT } from '@view'
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function CreationForm() {
  const [form] = Form.useForm()

  const hasRetention = Form.useWatch('hasRetention', form)
  const quota = Form.useWatch('quota', form)
  const costCenterId = Form.useWatch('cost_center', form)
  const totalAmount = Form.useWatch('amount', form)
  const supplierId = Form.useWatch('supplier', form)
  const cashbankId = Form.useWatch('cashbank', form)
  const categoryId = Form.useWatch('category_id', form)
  const retation = Form.useWatch('retention', form)
  const [quotas, setQuotas] = useState<{ number: number; amount: number }[]>([])

  const navigate = useNavigate()

  const { data: companies } = useQuery({
    queryKey: ['rq:companies'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
    },
  })

  const { data: suppliers } = useQuery({
    queryKey: ['rq:suppliers'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
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

  const { data: movesCash } = useQuery({
    queryKey: ['rq:moveCash'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.movescash.$get()
      const result = await request.json()
      console.log('result . data', result)
      return result.data as MoveCashSelect[]
    },
  })

  const { data: cashBanks } = useQuery({
    queryKey: ['rq:cashBanks'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const result = await request.json()
      return result.data as CashBankSelect[]
    },
  })

  //

  useEffect(() => {
    const costCenter = costCenters?.find((el) => el.id === costCenterId)
    if (costCenter) {
      form.setFieldValue('cost_center_name', costCenter.costcenter)
    } else {
      form.setFieldValue('cost_center_name', '')
    }
  }, [costCenterId])

  useEffect(() => {
    const cashBank = cashBanks?.find((el) => el.id === cashbankId)
    if (cashBank) {
      form.setFieldValue('cashbank_name', cashBank.cashbank)
    } else {
      form.setFieldValue('cashbank_name', '')
    }
  }, [cashbankId])

  useEffect(() => {
    const category = movesCash?.find((el) => el.id === categoryId)
    if (category) {
      form.setFieldValue('category_name', category.movecash)
    } else {
      form.setFieldValue('category_name', '')
    }
  }, [categoryId])

  useEffect(() => {
    const supplier = suppliers?.find((el) => el.id == supplierId)
    if (supplier) {
      form.setFieldsValue({
        legal_name: supplier.legal_name,
        ruc: supplier.legal_number,
      })
    } else {
      form.setFieldsValue({
        legal_name: '',
        ruc: '',
      })
    }
  }, [supplierId])

  // const getInfoRuc = useMutation({
  //   mutationFn: async (ruc: string) => {
  //     const result = await getNameByRuc(ruc)
  //     return result
  //   },
  //   onSuccess: (data) => {
  //     form.setFieldValue('legal_name', data.name)
  //   },
  // })

  const changeQuota = (increment: boolean) => {
    if (increment) {
      form.setFieldValue('quota', quota + 1)
    } else {
      if (quota === 1) return
      form.setFieldValue('quota', quota - 1)
    }
  }

  const createMt = useMutation({
    mutationFn: async (data: CreateRequirementDto) => {
      const result = await viewClient.api.view.requirement.create.$post({
        json: data,
      })
      if (!result.ok) throw new Error('No se pudo crear el requerimiento')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate(PATHS.erp.modulos.requerimientos.solicitados)
    },
  })

  const onFinish = (values: CreateRequirementDto) => {
    createMt.mutate({
      ...values,
      detailQuotas: quotas,
    })
  }

  useEffect(() => {
    const total = totalAmount - (hasRetention ? retation : 0)
    const amountByQuota = +(total / quota).toFixed(2)

    setQuotas(
      Array.from({ length: quota }).map((_, index) => ({
        number: index + 1,
        amount: amountByQuota,
      })),
    )
  }, [quota, totalAmount, retation, hasRetention])

  return (
    <div className="flex justify-center gap-3">
      <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0">
        <div
          className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex"
          onClick={() => navigate(PATHS.erp.modulos.requerimientos.solicitados)}
        >
          <ArrowLeft className="" size={16} />
          Volver
        </div>
        <Form
          labelAlign="left"
          name="rq-create-form"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          form={form}
          className="w-[800px]"
          initialValues={
            {
              quota: 1,
              description: '',
              amount: 1,
              hasRetention: false,
              retention: 0,
            } satisfies Partial<CreateRequirementDto>
          }
        >
          <Form.Item name={'cost_center_name'} className="hidden">
            <Input />
          </Form.Item>
          <Form.Item name={'category_name'} className="hidden">
            <Input />
          </Form.Item>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Empresa"
              className=""
              name="company"
              rules={[{ required: true }]}
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
            <Form.Item
              label="Proveedor"
              name="supplier"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Proveedor"
                filterOption={filterSelectForm}
                showSearch
              >
                {suppliers?.map((supplier) => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.supplier}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="RUC proveedor"
              name="ruc"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="RUC proveedor"
                // loading={getInfoRuc.isPending}
                readOnly
                // onSearch={(ruc) => {
                //   getInfoRuc.mutate(ruc.trim())
                // }}
              />
            </Form.Item>
          </div>
          <div className="grid-cols-2 gap-2 hidden">
            <Form.Item
              label="R. social"
              name="legal_name"
              rules={[{ required: true }]}
            >
              <Input
                readOnly
                placeholder="Ingresa el ruc y presiona el boton"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Detalle"
              labelAlign="left"
              labelCol={{ span: 4 }}
              name="description"
            >
              <Input.TextArea
                placeholder="Descripcion"
                rows={2}
                className="resize-none"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Tipo doc."
              name="document_type"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Requerimiento"
                filterOption={filterSelectForm}
              >
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
                  Factura
                </Select.Option>
                <Select.Option
                  value={REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA}
                >
                  Factura
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="N° doc." name="document_number">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Categoria" name="category_id">
              <Select
                placeholder="Categorias"
                showSearch
                filterOption={filterSelectForm}
              >
                {movesCash?.map((moveCash) => (
                  <Select.Option key={moveCash.id} value={moveCash.id}>
                    {moveCash.movecash}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Centro de costo" name="cost_center">
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

          <Divider />
          <h5>Datos del pago:</h5>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Monto"
              name="amount"
              rules={[
                { required: true },
                {
                  type: 'number',
                  min: 0,
                },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item label="Caja" name={'cashbank'}>
              <Select placeholder="Caja">
                {cashBanks?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="CajaNombre"
              name={'cashbank_name'}
              className="hidden"
            >
              <Select placeholder="Caja">
                {cashBanks?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Forma de pago" name={'payment_method'}>
              <Select placeholder="pago">
                <Select.Option value="CONTADO">CONTADO</Select.Option>
                <Select.Option value="CREDITO">CREDITO</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Vencimiento" name={'expiration_date'}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Tiene retencion"
              name="hasRetention"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item label="Retencion" name={'retention'}>
              <InputNumber placeholder="0.0" disabled={!hasRetention} />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="N° cuota" labelCol={{ span: 4 }} name={'quota'}>
              <InputNumber readOnly min={1} value={quota} />
            </Form.Item>
          </div>
          <Form.Item wrapperCol={{ span: 6, offset: 4 }}>
            <div>
              <div className="grid grid-cols-2 font-semibold mb-2">
                <p>N° cuota</p>
                <p>Monto</p>
              </div>
              {quotas.map((el) => {
                return (
                  <div key={el.number} className="flex items-center relative">
                    <div className="grid grid-cols-2 my-2 gap-2">
                      <InputNumber readOnly value={el.number} />
                      <InputNumber readOnly value={el.amount} />
                    </div>
                    {el.number == 1 && (
                      <div className="absolute left-full">
                        {' '}
                        <div className="flex gap-1 items-center">
                          <Button
                            size="small"
                            onClick={() => changeQuota(true)}
                            type="primary"
                          >
                            <Plus className="w-4 text-white" />
                          </Button>
                          <Button
                            size="small"
                            onClick={() => changeQuota(false)}
                            type="primary"
                          >
                            <Minus className="w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Form.Item>
          <Form.Item labelCol={{ span: 4 }} className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Crear
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
