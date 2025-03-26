import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
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
import { useQuery } from '@tanstack/react-query'
import { REQUIERMENT_TYPE, REQUIREMENT_TYPE_DOCUMENT } from '@view'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

export function Review({
  data,
  beforeUrl,
}: {
  data: RequirementRelationsSelect
  beforeUrl?: string | null
}) {
  const navigate = useNavigate()
  const { requirement, items } = useMemo(() => {
    const { items: _items, supplier, ...rest } = data
    return { requirement: rest, items: _items ?? [], supplier }
  }, [data])
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

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
          >
            <div className="grid grid-cols-2 gap-x-1">
              <Form.Item label="Id" name={'id'} className="mb-2">
                <Input />
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
                  <Select.Option value={REQUIERMENT_TYPE.SIMPLE}>
                    Solicitado
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.TRANSFER}>
                    Transferencia
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.SUPPLIER}>
                    Proveedor
                  </Select.Option>
                  <Select.Option value={REQUIERMENT_TYPE.LIQUIDATION}>
                    Liquidacion
                  </Select.Option>
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
                    form.setFieldValue('supplier', id)
                    form.setFieldValue('supplier_name', supplier)
                    form.setFieldValue('ruc', ruc)
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
                      {moveCash.movecash}
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
          </Form>
        </div>

        {/* DIVIDER */}

        <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 bg-white shadow-md">
          <RequirementItems items={items} requirement={requirement} />
        </div>
      </div>
    </div>
  )
}
const RequirementItems = ({
  items,
  requirement,
}: {
  items: RequirementItemSelect[]
  requirement: RequirementSelect
}) => {
  const [form] = Form.useForm()
  const [isEdited, setIsEdited] = useState(false)
  const [numQuota, setNumQuota] = useState(() => {
    return items.length > 0 ? 0 : null
  })
  // const [selected, set_selected] = useState<RequirementItemSelect | null>(
  //   items.length > 0 ? items[0] : null,
  // )

  const handleSave = () => {
    // console.log('handle save : ', selected, items)
  }

  const resetFields = () => {
    // const item = items.find((item) => item.id === selected?.id)
    // if (item) {
    //   form.setFieldsValue(item)
    //   set_selected(item)
    //   setIsEdited(false)
    // } else {
    //   message.error('Item no encontrado')
    // }
  }

  // Add useEffect to reset form values when selected changes
  // useEffect(() => {
  //   if (selected) {
  //     form.setFieldsValue(selected)
  //   }
  // }, [selected, form])

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
    <div>
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Select
              placeholder="Seleccionar cuota"
              // value={items.indexOf(selected!)}
              value={numQuota}
              onChange={(index) => {
                setNumQuota(index)
                const item = items[index]
              }}
              className="w-1/2"
            >
              {items.map((_item, index) => (
                <Select.Option key={index} value={index}>
                  Cuota {index + 1}
                </Select.Option>
              ))}
            </Select>
          </div>
          {items.length > 0 && (
            <div>
              <h5 className="mb-2">Datos del pago:</h5>
              <Form
                form={form}
                wrapperCol={{ span: 18 }}
                labelCol={{ span: 6 }}
                initialValues={items.length > 0 ? items[0] : {}}
                // onValuesChange={(_changedValues, allValues) => {
                //   setIsEdited(true)
                //   const updatedItemIndex = items.indexOf(selected)
                //   if (updatedItemIndex !== -1) {
                //     items[updatedItemIndex] = { ...selected, ...allValues }
                //     set_selected(items[updatedItemIndex])
                //   }
                // }}
              >
                <div className="grid grid-cols-2 gap-x-1">
                  <Form.Item name={'id'} label="Id">
                    <Input />
                  </Form.Item>
                  <div></div>
                  <Form.Item
                    className="mb-2"
                    label="Monto"
                    name="amount"
                    rules={[{ required: true }]}
                  >
                    <InputNumber className="w-full" />
                  </Form.Item>
                  <Form.Item className="mb-2" label="Caja" name={'cashbank_id'}>
                    <Select showSearch filterOption={filterSelectForm}>
                      {cash_banks?.map((cash_bank) => (
                        <Select.Option key={cash_bank.id} value={cash_bank.id}>
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
                    <Select placeholder="pago" value={requirement.pay_method}>
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
                  <Form.Item className="mb-2" label="Valor cuota" name="amount">
                    <InputNumber readOnly className="w-full" />
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
                  >
                    <Switch
                    // checked={item.hasRetention}
                    // onChange={(val) =>
                    //   // setItemWrapper({ ...item, hasRetention: val })
                    // }
                    />
                  </Form.Item>
                  <div className="flex gap-2">
                    <Form.Item name={'retention'} label="Retencion">
                      <Input readOnly />
                    </Form.Item>
                    <Form.Item name={'retention'} label="Neto">
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
              hidden: !isEdited,
            })}
          >
            <Button type="primary" danger>
              Rechazar
            </Button>
            <Button type="primary" onClick={handleSave}>
              Aprobar
            </Button>
          </div>
          <div
            className={cn('flex justify-end gap-2', {
              hidden: isEdited,
            })}
          >
            <Button type="primary" danger onClick={() => resetFields()}>
              Cancelar
            </Button>
            <Button type="primary" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
