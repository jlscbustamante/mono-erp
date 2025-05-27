import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { CustomInputPositive } from '@/components/ant-form/custom-input-negative'
import { CustomSwitchNumber } from '@/components/ant-form/custom-switch-number'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { cn, filterSelectForm } from '@/utils'
import { CreateSupplier } from '@/views/products/components/productItem/CreateSupplier'
import {
  CashBankSelect,
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  RequirementItemSelect,
  RequirementRelationsSelect,
  RequirementSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  PAYMENT_METHOD,
  REQUIREMENT_STATUS,
  REQUIREMENT_TYPE,
  REQUIREMENT_TYPE_DOCUMENT,
} from '@view'
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { RejectModal } from './reject-modal'

export function Review({
  data,
  beforeUrl,
  refetch,
}: {
  data: RequirementRelationsSelect
  beforeUrl?: string | null
  refetch?: () => void
}) {
  const navigate = useNavigate()
  const [isModified, setIsModified] = useState(false)
  const { requirement, items } = useMemo(() => {
    const { items: _items, supplier, ...rest } = data
    return { requirement: rest, items: _items ?? [], supplier }
  }, [data])
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const payMethod = Form.useWatch('pay_method', form)

  const changePayMethod = (val: string) => {
    form.setFieldsValue({ pay_method: val })
  }

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

  const searchSupplier = (ruc: string) => {
    const supplier = suppliers?.find((el) => el.legal_number === ruc)
    if (supplier) {
      form.setFieldValue('legal_name', supplier.legal_name)
      form.setFieldValue('supplier_id', supplier.id)
    } else {
      form.setFieldValue('legal_name', undefined)
      form.setFieldValue('supplier_id', undefined)
      messageApi.error('Proveedor no encontrado')
    }
  }

  return (
    <div>
      {contextHolder}
      <div className="container mx-auto gap-2 grid grid-cols-1 lg:grid-cols-2">
        <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 bg-white shadow-md">
          <div
            className="text-slate-600 transition-colors items-center hover:text-slate-800 cursor-pointer inline-flex gap-3"
            onClick={() =>
              navigate(
                beforeUrl ?? PATHS.erp.modulos.requerimientos.solicitados,
              )
            }
          >
            <ArrowLeft size={20} />
            REQUERIMIENTO
          </div>
          <Divider className="mt-2" />
          <Form
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            initialValues={requirement}
            form={form}
            onValuesChange={() => {
              setIsModified(true)
            }}
          >
            <div className="grid grid-cols-2 gap-x-1">
              <Form.Item label="Id" name={'id'} className="mb-2">
                <Input readOnly />
              </Form.Item>
              <div></div>
              <Form.Item label="Empresa" name="company_id" className="mb-2">
                <Select placeholder="Empresa">
                  {companies?.map((company) => (
                    <Select.Option key={company.id} value={company.id}>
                      {company.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item className="mb-2" label="Tipo" name={'request_type'}>
                {/* <Input readOnly /> */}
                <Select>
                  <Select.Option value={REQUIREMENT_TYPE.SIMPLE}>
                    Solicitado
                  </Select.Option>
                  <Select.Option value={REQUIREMENT_TYPE.SUPPLIER}>
                    Proveedor
                  </Select.Option>
                  {/* <Select.Option value={REQUIERMENT_TYPE.TRANSFER}>
                    Transferencia
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.LIQUIDATION}>
                    Liquidacion
                  </Select.Option> */}
                </Select>
              </Form.Item>
              <Form.Item
                label="RUC"
                name="legal_number"
                className="mb-2"
                rules={[{ required: true }]}
              >
                <Input.Search
                  placeholder="RUC"
                  // loading={getInfoRuc.isPending}
                  onSearch={(ruc) => {
                    searchSupplier(ruc)
                  }}
                  // onSearch={(ruc) => {
                  //   getInfoRuc.mutate(ruc.trim())
                  // }}
                />
              </Form.Item>
              <div className="flex gap-1">
                <Form.Item name={'supplier_id'} hidden>
                  <Input />
                </Form.Item>
                <Form.Item
                  className="mb-2 flex-1"
                  label="Proveedor"
                  name="legal_name"
                  rules={[{ required: true }]}
                  labelCol={{ span: 9 }}
                >
                  <Input placeholder="Proveedor" readOnly />
                </Form.Item>
                <CreateSupplier
                  suppliers={suppliers ?? []}
                  onError={(message) => {
                    messageApi.error(message)
                  }}
                  onCreate={(id, supplier, ruc) => {
                    form.setFieldValue('supplier_id', id)
                    form.setFieldValue('legal_name', supplier)
                    form.setFieldValue('legal_number', ruc)
                    refetchSupplier()
                  }}
                />
              </div>
              <Form.Item
                label="Detalle"
                name={'description'}
                className="col-span-2 mb-2"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <Input.TextArea rows={1} />
              </Form.Item>
              <Form.Item
                label="Tipo doc."
                name="type_document"
                rules={[{ required: true }]}
                className="mb-2"
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
                    Factura
                  </Select.Option>
                  <Select.Option
                    value={REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA}
                  >
                    Factura
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="N° doc." name="num_document" className="mb-2">
                <Input />
              </Form.Item>
              <Form.Item label="Categoria" name="movecash_id" className="mb-2">
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
              <Form.Item
                label="Centro de costo"
                name="costcenter_id"
                className="mb-2"
              >
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
            <Form.Item
              className="mb-2"
              label="Forma de pago"
              rules={[{ required: true }]}
              name={'pay_method'}
              hidden
            >
              <Select placeholder="pago" value={requirement.pay_method}>
                <Select.Option value="CONTADO">CONTADO</Select.Option>
                <Select.Option value="CREDITO">CREDITO</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </div>

        {/* DIVIDER */}

        <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 bg-white shadow-md">
          <RequirementItems
            form={form}
            isModified={isModified}
            setIsModified={setIsModified}
            items={items}
            requirement={requirement}
            refetch={refetch}
            payMethod={payMethod}
            setPayMethod={changePayMethod}
          />
        </div>
      </div>
    </div>
  )
}

const RequirementItems = ({
  items,
  requirement,
  refetch,
  payMethod,
  setPayMethod,
  isModified,
  setIsModified,
  form: formRequirement,
}: {
  form: FormInstance<any>
  items: RequirementItemSelect[]
  requirement: RequirementSelect
  refetch?: () => void
  payMethod: PAYMENT_METHOD
  setPayMethod: (val: PAYMENT_METHOD) => void
  isModified: boolean
  setIsModified: (val: boolean) => void
}) => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false)
  const [isEdited, setIsEdited] = useState(false)

  const hasChanges = useMemo(() => {
    return isEdited || isModified
  }, [isEdited, isModified])

  const [numQuota, setNumQuota] = useState(() => {
    return items.length > 0 ? 0 : null
  })

  const saveItemMt = useMutation({
    mutationFn: async (props: {
      requirement: RequirementSelect
      item: RequirementItemSelect
    }) => {
      await viewClient.api.view.requirement.update_requirement.$put({
        json: props,
      })
    },
    onSuccess: () => {
      setIsEdited(false)
      setIsModified(false)
      refetch?.()
    },
  })

  const approveMt = useMutation({
    mutationFn: async (data: number) => {
      const result = await viewClient.api.view.requirement.approve.$post({
        json: { id: data },
      })
      if (!result.ok) throw new Error('No se pudo aprobar el requerimiento')
    },
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      // refetch?.()
      navigate(PATHS.erp.modulos.requerimientos.solicitados)
    },
  })

  const handleSave = () => {
    const requirementValues =
      formRequirement.getFieldsValue() as RequirementSelect
    const requirementItem = form.getFieldsValue() as RequirementItemSelect
    saveItemMt.mutate({
      item: requirementItem,
      requirement: requirementValues,
    })
  }

  const handleApprove = () => {
    approveMt.mutate(requirement.id)
  }

  const resetFields = () => {
    formRequirement.setFieldsValue(requirement)
    setIsModified(false)
    const item = numQuota != null ? items[numQuota] : null
    if (item) {
      form.setFieldsValue(item)
    }
    setIsEdited(false)
  }

  const { data: cash_banks } = useQuery({
    queryKey: ['rq:cashBanks'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const result = await request.json()
      return (result.data as CashBankSelect[]) ?? []
    },
  })

  return (
    <>
      <RejectModal
        onChange={setOpenModal}
        open={openModal}
        id={requirement.id}
        requestId={requirement.id}
      />
      <div>
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center hidden">
              <Select
                variant="borderless"
                placeholder="Seleccionar cuota"
                value={numQuota}
                onChange={(index) => {
                  if (isEdited) {
                    Modal.confirm({
                      title: '¿Desea salir de la edicion?',
                      content:
                        'Tienes cambios de esta cuota sin guardar, si continua se perderan ¿Desea continuar?',
                      onOk: () => {
                        setNumQuota(index)
                        const item = items[index]
                        form.setFieldsValue(item)
                        setIsEdited(false)
                      },
                    })
                  } else {
                    setNumQuota(index)
                    const item = items[index]
                    form.setFieldsValue(item)
                  }
                }}
                // className="w-1/2"
                className="p-0"
              >
                {items
                  .filter((el) => el.status == REQUIREMENT_STATUS.PENDING)
                  .map((_item, index) => (
                    <Select.Option key={index} value={index}>
                      Cuota {index + 1}
                    </Select.Option>
                  ))}
              </Select>
            </div>
            <Divider className="my-0 mb-3 hidden" />
            {items.length > 0 && (
              <div>
                <h5 className="mb-2">Datos del pago:</h5>
                <Form
                  form={form}
                  wrapperCol={{ span: 18 }}
                  labelCol={{ span: 6 }}
                  initialValues={items.length > 0 ? items[0] : {}}
                  onValuesChange={() => {
                    setIsEdited(true)
                  }}
                >
                  <div className="grid grid-cols-2 gap-x-1">
                    <Form.Item name={'id'} label="Id" className="mb-2 hidden">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={'status'}
                      label="Estado"
                      className="mb-2 hidden"
                    >
                      <Input readOnly />
                    </Form.Item>
                    <Form.Item
                      className="mb-2"
                      label="Monto"
                      // name="amount"
                      // rules={[{ required: true }]}
                    >
                      <InputNumber
                        className="w-full"
                        value={requirement.amount}
                        readOnly
                      />
                    </Form.Item>
                    <Form.Item
                      className="mb-2"
                      label="Caja"
                      name={'cashbank_id'}
                    >
                      <Select showSearch filterOption={filterSelectForm}>
                        {cash_banks?.map((cash_bank) => (
                          <Select.Option
                            key={cash_bank.id}
                            value={cash_bank.id}
                          >
                            {cash_bank.cashbank}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      className="mb-2"
                      label="Forma de pago"
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="pago"
                        value={payMethod}
                        onChange={setPayMethod}
                      >
                        <Select.Option value="CONTADO">CONTADO</Select.Option>
                        <Select.Option value="CREDITO">CREDITO</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      className="mb-2"
                      label="Vencimiento"
                      name={'expires_at'}
                    >
                      <CustomDatePicker className="w-full" />
                    </Form.Item>
                    <Form.Item label="N° cuota" className="mb-2">
                      <Input
                        value={numQuota != null ? numQuota + 1 : undefined}
                        readOnly
                      />
                    </Form.Item>
                    <Form.Item
                      className="mb-2"
                      label="Valor cuota"
                      name="amount"
                    >
                      {/* <InputNumber readOnly className="w-full" /> */}
                      <CustomInputPositive />
                    </Form.Item>
                    <Form.Item
                      className="mb-2 col-span-2 "
                      label="Detalle"
                      name="description"
                      labelCol={{ span: 3 }}
                      wrapperCol={{ span: 21 }}
                    >
                      <Input.TextArea rows={1} />
                    </Form.Item>
                    <Form.Item
                      label="Tiene retencion"
                      // labelCol={{ span: 4 }}
                      className="mb-2"
                      name={'retention'}
                    >
                      <CustomSwitchNumber />
                      {/* <Switch
                    /> */}
                    </Form.Item>
                    <div className="flex gap-2">
                      <Form.Item name={'amount_ret'} label="Retencion">
                        <Input readOnly />
                      </Form.Item>
                      <Form.Item name={'amount_net'} label="Neto">
                        <Input readOnly />
                      </Form.Item>
                    </div>
                    {/*  */}
                    <Form.Item
                      className="mb-2"
                      label="Creado por"
                      name="created_by"
                    >
                      <Input readOnly />
                    </Form.Item>
                  </div>
                </Form>
              </div>
            )}

            <div
              className={cn('flex justify-end gap-2', {
                hidden: hasChanges,
              })}
            >
              <Button type="primary" danger onClick={() => setOpenModal(true)}>
                Rechazar
              </Button>
              <Button
                type="primary"
                onClick={handleApprove}
                loading={approveMt.isPending}
              >
                Aprobar
              </Button>
            </div>
            <div
              className={cn('flex justify-end gap-2', {
                hidden: !hasChanges,
              })}
            >
              <Button type="primary" danger onClick={() => resetFields()}>
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={handleSave}
                loading={saveItemMt.isPending}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
