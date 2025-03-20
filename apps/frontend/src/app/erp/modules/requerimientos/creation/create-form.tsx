import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CreateSupplier } from '@/views/products/components/productItem/CreateSupplier'
import {
  CashBankSelect,
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreateRequirementDto,
  REQUIERMENT_TYPE,
  REQUIREMENT_TYPE_DOCUMENT,
} from '@view'
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from 'antd'
import dayjs from 'dayjs'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function CreationForm({
  changeType,
  type,
}: {
  changeType: (type: REQUIERMENT_TYPE) => void
  type: REQUIERMENT_TYPE
}) {
  const [form] = Form.useForm()

  const hasRetention = Form.useWatch('hasRetention', form)
  const quota = Form.useWatch('quota', form)
  const costCenterId = Form.useWatch('cost_center', form)
  const totalAmount = Form.useWatch('amount', form)
  const cashbankId = Form.useWatch('cashbank', form)
  const categoryId = Form.useWatch('category_id', form)
  const company = Form.useWatch('company', form)
  // const ruc = Form.useWatch('ruc', form)
  const [quotas, setQuotas] = useState<
    { number: number; amount: number; expiresAt?: string }[]
  >([])
  const [hasQuota, setHasQuota] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

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

  const { data: suppliers, refetch: refetchSupplier } = useQuery({
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

  const isTotalAmountMatched = useMemo(() => {
    let total = 0
    quotas.forEach((el) => {
      total += el.amount
    })

    const diffAbs = Math.abs(+(total - totalAmount).toFixed(2))
    return diffAbs <= 0.01
  }, [quotas])

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

  // useEffect(() => {
  //   const supplier = suppliers?.find((el) => el.legal_number === ruc)
  //   if (supplier) {
  //     form.setFieldsValue({
  //       supplier: supplier?.legal_name,
  //     })
  //   } else {
  //     // mostrar que no existe el ruc
  //   }
  // }, [ruc])

  const searchSupplier = (ruc: string) => {
    const supplier = suppliers?.find((el) => el.legal_number === ruc)
    if (supplier) {
      form.setFieldValue('supplier_name', supplier.legal_name)
      form.setFieldValue('supplier', supplier.id)
    } else {
      form.setFieldValue('supplier_name', undefined)
      form.setFieldValue('supplier', undefined)
      messageApi.error('Proveedor no encontrado')
    }
  }

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

  const changeQuotaAmount = (
    numQuota: number,
    amount: number,
    expiresAt?: string,
  ) => {
    const newQuotas = quotas.map((el) => {
      if (el.number === numQuota) {
        el.amount = amount
        el.expiresAt = expiresAt
      }
      return el
    })
    setQuotas(newQuotas)
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
      request_type: type,
    })
  }

  useEffect(() => {
    if (!hasQuota) {
      setQuotas([
        {
          number: 1,
          amount: totalAmount,
        },
      ])
      form.setFieldValue('quota', 1)
    }
  }, [hasQuota])

  useEffect(() => {
    const total = totalAmount
    const amountByQuota = +(total / quota).toFixed(2)

    setQuotas(
      Array.from({ length: quota }).map((_, index) => ({
        number: index + 1,
        amount: amountByQuota,
      })),
    )
  }, [quota, totalAmount])

  return (
    <>
      {contextHolder}
      <div className="flex justify-center gap-3">
        <Form
          labelAlign="left"
          name="rq-create-form"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          form={form}
          // className="w-[800px]"
          className="flex gap-1 flex-wrap justify-center"
          initialValues={
            {
              quota: 1,
              description: '',
              amount: 1,
              hasRetention: false,
              retention: 0,
              company: 'PIZZARAUL',
            } satisfies Partial<CreateRequirementDto>
          }
        >
          <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 bg-white shadow-md">
            <div
              className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex gap-3"
              onClick={() =>
                navigate(PATHS.erp.modulos.requerimientos.solicitados)
              }
            >
              <ArrowLeft className="" size={20} />
              NUEVO REQUERIMIENTO
            </div>
            <Divider className="mt-2" />

            <Form.Item name={'cost_center_name'} hidden>
              <Input />
            </Form.Item>
            <Form.Item name={'category_name'} hidden>
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Empresa"
                className="mb-2"
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
              <Form.Item label="Tipo" className="mb-2">
                <Select placeholder="Tipo" value={type} onChange={changeType}>
                  <Select.Option value={REQUIERMENT_TYPE.SIMPLE}>
                    SIMPLE
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.TRANSFER}>
                    TRANSFERENCIA
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.LIQUIDATION}>
                    LIQUIDACION
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="RUC proveedor"
                name="ruc"
                className="mb-2"
                rules={[{ required: true }]}
              >
                <Input.Search
                  placeholder="RUC proveedor"
                  // loading={getInfoRuc.isPending}
                  onSearch={(ruc) => {
                    searchSupplier(ruc)
                  }}
                  // onSearch={(ruc) => {
                  //   getInfoRuc.mutate(ruc.trim())
                  // }}
                />
              </Form.Item>
              <Form.Item
                className="mb-2"
                label="Proveedor"
                name="supplier"
                rules={[{ required: true }]}
                hidden
              >
                <Input placeholder="Proveedor" />
              </Form.Item>

              <Form.Item
                className="mb-2"
                label="Proveedor"
                name="supplier_name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Proveedor" readOnly />
              </Form.Item>
              <CreateSupplier
                onCreate={(id, supplier, ruc) => {
                  form.setFieldValue('supplier', id)
                  form.setFieldValue('supplier_name', supplier)
                  form.setFieldValue('ruc', ruc)
                  refetchSupplier()
                }}
              />
            </div>
            <div className="grid-cols-2 gap-2 hidden">
              <Form.Item
                className="mb-2"
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
                className="mb-2"
                labelAlign="left"
                labelCol={{ span: 4 }}
                name="description"
              >
                <Input.TextArea
                  placeholder="Descripcion"
                  rows={1}
                  className="resize-none"
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Tipo doc."
                name="document_type"
                className="mb-2"
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
                  <Select.Option
                    value={REQUIREMENT_TYPE_DOCUMENT.TICKET_SALIDA}
                  >
                    Ticket salida
                  </Select.Option>
                  <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.NOTA_CREDITO}>
                    Nota credito
                  </Select.Option>
                  <Select.Option value={REQUIREMENT_TYPE_DOCUMENT.NOTA_DEBITO}>
                    Factura
                  </Select.Option>
                  <Select.Option
                    value={REQUIREMENT_TYPE_DOCUMENT.GUIA_REMISION}
                  >
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
                label="N° doc."
                name="document_number"
                className="mb-2"
              >
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
          </div>
          {/* SEPARACION */}
          <div className="bg-white rounded-md p-6 shadow-md border border-solid border-slate-300">
            <p>
              <h5 className="mb-3">Datos del pago:</h5>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item
                  className="mb-2"
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
                <Form.Item label="Caja" name={'cashbank'} className="mb-2">
                  <Select placeholder="Caja">
                    {cashBanks
                      ?.filter((el) => {
                        if (company) {
                          return el.company_id == company
                        }
                        return true
                      })
                      .map((cashBank) => (
                        <Select.Option key={cashBank.id} value={cashBank.id}>
                          {cashBank.cashbank}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item label="CajaNombre" name={'cashbank_name'} hidden>
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
                <Form.Item
                  label="Forma de pago"
                  name={'payment_method'}
                  className="mb-2"
                >
                  <Select placeholder="pago">
                    <Select.Option value="CONTADO">CONTADO</Select.Option>
                    <Select.Option value="CREDITO">CREDITO</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Vencimiento"
                  name={'expiration_date'}
                  className="mb-2"
                >
                  <CustomDatePicker className="w-full" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Form.Item
                  className="mb-2"
                  label="Tiene retencion"
                  name="hasRetention"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
                <Form.Item
                  label="Retencion"
                  name={'retention'}
                  className="mb-2"
                >
                  <InputNumber
                    placeholder="0.0"
                    disabled={!hasRetention}
                    min={0}
                  />
                </Form.Item>
              </div>
              <div className="grid grid-cols-[repeat(24,1fr)] grid-rows-1 mb-4">
                <label htmlFor="" className="col-span-4">
                  Pago al crédito
                </label>
                <div className="col-span-9 flex items-center gap-8">
                  <Switch
                    checkedChildren="Si"
                    unCheckedChildren="No"
                    onChange={() => {
                      setHasQuota(!hasQuota)
                    }}
                    checked={hasQuota}
                  />
                  <Form.Item
                    label="N° cuota"
                    name={'quota'}
                    className="mb-0 "
                    // labelCol={{ span: 1 }}
                    labelCol={{ span: 10 }}
                  >
                    <InputNumber
                      readOnly
                      min={1}
                      value={quota}
                      disabled={true}
                      className="!text-slate-800"
                    />
                  </Form.Item>
                </div>
              </div>
              <Form.Item
                wrapperCol={{ span: 14, offset: 4 }}
                hidden={!hasQuota}
              >
                <div>
                  <div className="grid grid-cols-[100px_100px_1fr] font-semibold mb-2 gap-3">
                    <p>N° cuota</p>
                    <p>Monto</p>
                    <p>Vencimiento</p>
                  </div>
                  {quotas.map((el) => {
                    return (
                      <div
                        key={el.number}
                        className="flex items-center relative"
                      >
                        <div className="grid grid-cols-[100px_100px_1fr] my-1 gap-3 w-full">
                          <InputNumber readOnly value={el.number} />
                          <InputNumber
                            value={el.amount}
                            min={0.01}
                            onChange={(value) => {
                              if (value)
                                changeQuotaAmount(
                                  el.number,
                                  value,
                                  el.expiresAt,
                                )
                            }}
                          />
                          <DatePicker
                            className=""
                            allowClear={true}
                            value={el.expiresAt ? dayjs(el.expiresAt) : null}
                            onChange={(val) => {
                              if (val) {
                                changeQuotaAmount(
                                  el.number,
                                  el.amount,
                                  val.format('YYYY-MM-DD'),
                                )
                              } else {
                                changeQuotaAmount(el.number, el.amount)
                              }
                            }}
                          />
                        </div>
                        {el.number == 1 && (
                          <div className="absolute left-full ml-2">
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
                <div>
                  {isTotalAmountMatched ? (
                    ''
                  ) : (
                    <span className="text-red-500">El total no coincide</span>
                  )}
                </div>
              </Form.Item>
              <Form.Item labelCol={{ span: 4 }} className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createMt.isPending}
                  disabled={!isTotalAmountMatched}
                >
                  Guardar
                </Button>
              </Form.Item>
            </p>
          </div>
        </Form>
      </div>
    </>
  )
}
