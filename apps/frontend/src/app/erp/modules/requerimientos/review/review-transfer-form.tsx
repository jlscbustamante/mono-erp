import { RejectModal } from '@/app/erp/modules/requerimientos/review/reject-modal'
import { useSession } from '@/app/erp/use-session'
import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { cn, filterSelectForm } from '@/utils'
import { CashBankSelect, CompanySelect } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  IRequirementDetail,
  REQUIREMENT_STATUS,
  REQUIREMENT_TYPE_DOCUMENT,
} from '@view'
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { UpdateTransferRequirementDto } from '../../../../../../../../backend/views/modules/requirement/interfaces/update-requirement.dto'

export function ReviewTransferForm({
  data,
  beforeUrl,
}: {
  data: IRequirementDetail
  beforeUrl?: string | null
}) {
  const [form] = Form.useForm()

  const [_errors, _setErrors] = useState<Record<string, string | null>>({
    cashbankId: null,
  })

  const [openModal, setOpenModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const session = useSession((st) => st.user)

  const cashOriginId = Form.useWatch('cash_origin_id', form)
  const cashDestinyId = Form.useWatch('cash_destiny_id', form)

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
    const cashOrigin = cashBanks?.find((el) => el.id == cashOriginId)
    if (cashOrigin) {
      form.setFieldValue('cash_origin_name', cashOrigin.cashbank)
    } else {
      // form.setFieldValue('cash_origin_name', undefined)
    }
  }, [cashOriginId])

  useEffect(() => {
    const cashDestiny = cashBanks?.find((el) => el.id == cashDestinyId)
    if (cashDestiny) {
      form.setFieldValue('cash_destiny_name', cashDestiny.cashbank)
    } else {
      // form.setFieldValue('cash_destiny_name', undefined)
    }
  }, [cashDestinyId])

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
    mutationFn: async (data: UpdateTransferRequirementDto) => {
      const result = await viewClient.api.view.requirement.save_transfer.$put({
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
    })
    setIsEditing(false)
  }

  const onFinish = () => {
    form.validateFields()
    approveMt.mutate(data.id)
  }

  const cancelEdit = () => {
    form.resetFields()
    setIsEditing(false)
    // setItem({
    //   id: data.items[0].id,
    //   amount: data.items[0].amount,
    //   hasRetention: data.items[0].hasRetention,
    //   retention: data.items[0].retention,
    //   cashbankId: data.items[0].cashbankId ?? undefined,
    //   expiresAt: data.items[0].expiresAt ?? undefined,
    //   description: data.items[0].description,
    // })
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
        <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0">
          <div
            className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex"
            onClick={() =>
              navigate(
                beforeUrl ?? PATHS.erp.modulos.requerimientos.solicitados,
              )
            }
          >
            <ArrowLeft className="" size={16} />
            Volver
          </div>
          <Form
            labelAlign="left"
            name="rq-create-form"
            labelCol={{ span: 8 }}
            onFinish={() => null}
            onValuesChange={() => {
              setIsEditing(true)
            }}
            form={form}
            className="w-[800px]"
            initialValues={
              {
                id: data.id,
                companyId: data.companyId,
                description: data.description,
                documentNumber: data.documentNumber,
                documentType: data.documentType,
                payment_method: data.paymentMethod,
                amount: data.amount,
                origin_id: data.items[0].id,
                cash_origin_id: data.items[0].cashbankId ?? undefined,
                cash_origin_name: data.items[0].cashbankName ?? undefined,
                destiny_id: data.items[1].id,
                cash_destiny_id: data.items[1].cashbankId ?? undefined,
                cash_destiny_name: data.items[1].cashbankName ?? undefined,
                expiration_date: data.items[0].expiresAt ?? undefined,
                request_type: data.type,
              } satisfies Partial<UpdateTransferRequirementDto>
            }
          >
            <Form.Item name="request_type" className="hidden">
              <Input />
            </Form.Item>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item name={'id'} label="id">
                <Input readOnly />
              </Form.Item>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Empresa"
                name="companyId"
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
              <Form.Item>
                <Input readOnly value={'Simple'} />
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
                name="documentType"
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
                    Factura
                  </Select.Option>
                  <Select.Option
                    value={REQUIREMENT_TYPE_DOCUMENT.GUIA_TRANSPORTISTA}
                  >
                    Factura
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="N° doc." name="documentNumber">
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
            <Divider />
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Forma de pago" name={'payment_method'}>
                <Select placeholder="pago">
                  <Select.Option value="CONTADO">CONTADO</Select.Option>
                  <Select.Option value="CREDITO">CREDITO</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Vencimiento" name={'expiration_date'}>
                <CustomDatePicker className="w-full" />
              </Form.Item>
            </div>
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
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Caja Origen" name={'cash_origin_id'}>
                <Select placeholder="Caja">
                  {cashBanks?.map((cashBank) => (
                    <Select.Option key={cashBank.id} value={cashBank.id}>
                      {cashBank.cashbank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={'origin_id'} hidden>
                <Input />
              </Form.Item>
              <Form.Item name={'cash_origin_name'} hidden>
                <Input />
              </Form.Item>
              <Form.Item label="Caja Destino" name={'cash_destiny_id'}>
                <Select placeholder="Caja">
                  {cashBanks?.map((cashBank) => (
                    <Select.Option key={cashBank.id} value={cashBank.id}>
                      {cashBank.cashbank}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={'destiny_id'} hidden>
                <Input />
              </Form.Item>
              <Form.Item name={'cash_destiny_name'} hidden>
                <Input />
              </Form.Item>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-2">
              <Form.Item label="Creado por">
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
          </Form>
        </div>
      </div>
    </>
  )
}
