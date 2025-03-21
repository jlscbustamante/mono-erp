import { RejectModal } from '@/app/erp/modules/requerimientos/review/reject-modal'
import { useSession } from '@/app/erp/use-session'
import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { cn, filterSelectForm } from '@/utils'
import {
  CashBankSelect,
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  IRequirementDetail,
  REQUIREMENT_STATUS,
  REQUIREMENT_TYPE_DOCUMENT,
  UpdateRequirementDto,
  UpdateRequirementItemDto,
} from '@view'
import { Button, Divider, Form, Input, InputNumber, Select, Switch } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function ReviewForm({
  data,
  beforeUrl,
}: {
  data: IRequirementDetail
  beforeUrl?: string | null
}) {
  const [form] = Form.useForm()

  const [item, setItem] = useState<UpdateRequirementItemDto>({
    id: data.items[0].id,
    amount: data.items[0].amount,
    hasRetention: data.items[0].hasRetention,
    retention: data.items[0].retention,
    cashbankId: data.items[0].cashbankId ?? undefined,
    cashbankName: data.items[0].cashbankName ?? undefined,
    expiresAt: data.items[0].expiresAt ?? undefined,
    description: data.items[0].description,
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({
    cashbankId: null,
  })

  const [openModal, setOpenModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const session = useSession((st) => st.user)

  const supplierId = Form.useWatch('supplierId', form)
  const costCenterId = Form.useWatch('costCenterId', form)

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
      return result.data as MoveCashSelect[]
    },
  })

  const { data: cashBanks } = useQuery({
    queryKey: ['rq:cashBanks'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const result = await request.json()
      return (result.data as CashBankSelect[]) ?? []
    },
  })

  useEffect(() => {
    const costCenter = costCenters?.find((el) => el.id === costCenterId)
    if (costCenter) {
      form.setFieldValue('costCenterName', costCenter.costcenter)
    } else {
      form.setFieldValue('costCenterName', undefined)
    }
  }, [costCenterId])

  useEffect(() => {
    const supplier = suppliers?.find((el) => el.id == supplierId)
    if (supplier) {
      form.setFieldsValue({
        globalSupplierName: supplier.legal_name,
        globalSupplierRuc: supplier.legal_number,
      })
    } else {
      form.setFieldsValue({
        globalSupplierName: '',
        globalSupplierRuc: '',
      })
    }
  }, [supplierId])

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
      navigate(PATHS.erp.modulos.requerimientos.solicitados)
    },
  })

  const saveRequirementMt = useMutation({
    mutationFn: async (data: UpdateRequirementDto) => {
      const result = await viewClient.api.view.requirement.save.$put({
        json: data,
      })
      if (!result.ok) throw new Error('No se pudo guardar el requerimiento')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const undoApproveMt = useMutation({
    mutationFn: async (id: number) => {
      const result = await viewClient.api.view.requirement.undoApproval[
        ':id'
      ].$put({
        param: {
          id: id.toString(),
        },
      })
      if (!result.ok) throw new Error('No se pudo deshacer la aprobación')
    },
    onSuccess: () => {
      navigate(PATHS.erp.modulos.requerimientos.aprobados)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onSave = async () => {
    const values = form.getFieldsValue()
    await saveRequirementMt.mutateAsync({
      ...values,
      items: [item],
    })
    setIsEditing(false)
  }

  const onFinish = async () => {
    try {
      await form.validateFields()
      if (item.cashbankId) {
        approveMt.mutate(data.id)
      } else {
        toast.error('Seleccione caja')
        setErrors({
          ...errors,
          cashbankId: 'Seleccione una cuenta bancaria',
        })
      }
    } catch (err) {
      /* empty */
    }
  }

  const setItemWrapper = (editedItem: UpdateRequirementItemDto) => {
    setIsEditing(true)
    setItem(editedItem)
  }

  const cancelEdit = () => {
    form.resetFields()
    setIsEditing(false)
    setItem({
      id: data.items[0].id,
      amount: data.items[0].amount,
      hasRetention: data.items[0].hasRetention,
      retention: data.items[0].retention,
      cashbankId: data.items[0].cashbankId ?? undefined,
      expiresAt: data.items[0].expiresAt ?? undefined,
      description: data.items[0].description,
    })
  }

  return (
    <>
      <RejectModal
        onChange={setOpenModal}
        open={openModal}
        id={data.id}
        requestId={data.id}
      />
      <div className="flex justify-center gap-3">
        <Form
          labelAlign="left"
          name="rq-create-form"
          labelCol={{ span: 8 }}
          onFinish={() => null}
          onValuesChange={() => {
            setIsEditing(true)
          }}
          form={form}
          className="flex gap-2 flex-wrap justify-center"
          initialValues={
            {
              id: data.id,
              companyId: data.companyId,
              supplierId: data.supplierId,
              ruc: data.ruc,
              description: data.description,
              documentNumber: data.documentNumber,
              documentType: data.documentType,
              categoryId: data.categoryId ?? undefined,
              costCenterId: data.costCenterId ?? undefined,
              categoryName: data.categoryName ?? undefined,
              costCenterName: data.costCenterName ?? undefined,
              supplierName: data.legalName,
              paymentMethod: data.paymentMethod,
              amount: data.amount,
            } satisfies Partial<UpdateRequirementDto>
          }
        >
          <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 bg-white shadow-md w-[700px]">
            <div
              className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex gap-3"
              onClick={() =>
                navigate(
                  beforeUrl ?? PATHS.erp.modulos.requerimientos.solicitados,
                )
              }
            >
              <ArrowLeft className="" size={20} />
              REQUERIMIENTO
            </div>
            <Divider className="mt-2" />
            <Form.Item className="hidden" name={'costCenterName'}>
              <Input />
            </Form.Item>
            <Form.Item className="hidden" name={'cashBankName'}>
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item name={'id'} label="id" className="mb-2">
                <Input readOnly />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Empresa"
                name="companyId"
                className="mb-2"
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
              <Form.Item className="mb-2">
                <Input readOnly value={'Simple'} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Proveedor" name="supplierId" className="mb-2">
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
              <Form.Item name={'ruc'} className="mb-2">
                <Input />
              </Form.Item>
              <Form.Item name={'supplierName'} hidden>
                <Input />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Detalle"
                labelAlign="left"
                labelCol={{ span: 4 }}
                name="description"
                className="mb-2"
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
                name="documentType"
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
              <Form.Item label="N° doc." name="documentNumber" className="mb-2">
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Categoria" name="categoryId" className="mb-2">
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
                name="costCenterId"
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

              <Form.Item
                label="Categoria name"
                name="categoryName"
                className="hidden"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Asiento contable">
                <Select
                  placeholder="Asiento contable"
                  showSearch
                  filterOption={filterSelectForm}
                ></Select>
              </Form.Item>
            </div>
          </div>
          {/* SEPARACION */}
          <div className="bg-white rounded-md p-6 shadow-md border border-solid border-slate-300 w-[700px]">
            <h5>Datos del pago:</h5>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                className="mb-2"
                label="Monto"
                name="amount"
                rules={[{ required: true }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>
              <Form.Item
                label="Caja"
                rules={[{ required: true }]}
                required
                className="mb-2"
              >
                <div>
                  <Select
                    placeholder="Caja"
                    // status={errors.cashbankId ? 'error' : undefined}
                    value={item.cashbankId}
                    onChange={(val) => {
                      const cashBank = cashBanks?.find(
                        (cashBank) => cashBank.id === val,
                      )
                      if (cashBank)
                        setItemWrapper({
                          ...item,
                          cashbankId: cashBank.id,
                          cashbankName: cashBank.cashbank,
                        })
                    }}
                  >
                    {cashBanks?.map((cashBank) => (
                      <Select.Option key={cashBank.id} value={cashBank.id}>
                        {cashBank.cashbank}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Forma de pago"
                name={'paymentMethod'}
                rules={[{ required: true }]}
                className="mb-2"
              >
                <Select placeholder="pago">
                  <Select.Option value="CONTADO">CONTADO</Select.Option>
                  <Select.Option value="CREDITO">CREDITO</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Vencimiento" className="mb-2">
                <CustomDatePicker
                  className="w-full"
                  value={item.expiresAt}
                  onChange={(val) => {
                    if (val) setItemWrapper({ ...item, expiresAt: val })
                  }}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="N° cuota" className="mb-2">
                <InputNumber readOnly min={1} />
              </Form.Item>
              <Form.Item label="Valor quota" className="mb-2">
                <InputNumber
                  className="w-full"
                  value={item.amount}
                  onChange={(val) => {
                    if (val) setItemWrapper({ ...item, amount: val })
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              label="Detalle del pago"
              labelCol={{ span: 4 }}
              className="mb-2"
            >
              <Input.TextArea
                rows={1}
                value={item.description}
                onChange={(e) =>
                  setItemWrapper({ ...item, description: e.target.value })
                }
              ></Input.TextArea>
            </Form.Item>
            <Form.Item
              label="Tiene retencion"
              labelCol={{ span: 4 }}
              className="mb-2"
            >
              <Switch
                checked={item.hasRetention}
                onChange={(val) =>
                  setItemWrapper({ ...item, hasRetention: val })
                }
              />
            </Form.Item>
            <div
              className={cn('grid grid-cols-[repeat(24,1fr)] grid-rows-1', {
                hidden: !item.hasRetention,
              })}
            >
              <label htmlFor="" className="col-span-4"></label>
              <div className="col-span-12 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="">Retencion</label>
                  <InputNumber
                    value={item.retention}
                    onChange={(val) => {
                      if (val) setItemWrapper({ ...item, retention: val })
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="">Monto neto</label>
                  <Input readOnly value={item.amount - item.retention} />
                </div>
              </div>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Creado por" className="mb-2">
                <Input readOnly value={data.createdBy} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Aprobado por">
                <Input readOnly value={session.userName} />
              </Form.Item>
              <Form.Item name={'approvedAt'} label="Fecha de aprobación">
                <CustomDatePicker
                  className="w-full"
                  props={{
                    allowClear: false,
                  }}
                />
              </Form.Item>
            </div>
            <Form.Item
              labelCol={{ span: 4 }}
              className={cn('flex justify-end', {
                hidden: data.status != REQUIREMENT_STATUS.APPROVED,
              })}
            >
              <div>
                <Button
                  danger
                  onClick={() => undoApproveMt.mutate(data.id)}
                  loading={undoApproveMt.isPending}
                >
                  Deshacer aprobación
                </Button>
              </div>
            </Form.Item>
            <Form.Item
              labelCol={{ span: 4 }}
              className={cn('flex justify-end', {
                hidden: data.status != REQUIREMENT_STATUS.PENDING,
              })}
            >
              <div
                className={cn('flex gap-1', {
                  hidden: !isEditing,
                })}
              >
                <Button onClick={cancelEdit} danger type="primary">
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  onClick={() => onSave()}
                  loading={saveRequirementMt.isPending}
                >
                  Guardar cambios
                </Button>
              </div>
              <div
                className={cn('flex gap-1', {
                  hidden: isEditing,
                })}
              >
                <Button
                  danger
                  type="primary"
                  onClick={() => setOpenModal(true)}
                >
                  Rechazar
                </Button>
                <Button
                  loading={approveMt.isPending}
                  type="primary"
                  className=""
                  onClick={() => onFinish()}
                >
                  Aprobar
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}
