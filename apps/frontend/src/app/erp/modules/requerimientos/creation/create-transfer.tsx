import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CashBankSelect, CompanySelect } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  CreateRequirementDto,
  CreateRequirementTransferDto,
  REQUIERMENT_TYPE,
  REQUIREMENT_TYPE_DOCUMENT,
} from '@view'
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function CreationTransferForm({
  changeType,
  type,
}: {
  type: REQUIERMENT_TYPE
  changeType: (type: REQUIERMENT_TYPE) => void
}) {
  const [form] = Form.useForm()

  const cashbankId = Form.useWatch('cashbank_origin', form)
  const cashbankDestityId = Form.useWatch('cashbank_destiny', form)

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
      return result.data as CashBankSelect[]
    },
  })

  useEffect(() => {
    const cashBank = cashBanks?.find((el) => el.id === cashbankId)
    if (cashBank) {
      form.setFieldValue('cashbank_origin_name', cashBank.cashbank)
    } else {
      form.setFieldValue('cashbank_origin_name', '')
    }
  }, [cashbankId])

  useEffect(() => {
    const cashBank = cashBanks?.find((el) => el.id === cashbankId)
    if (cashBank) {
      form.setFieldValue('cashbank_destiny_name', cashBank.cashbank)
    } else {
      form.setFieldValue('cashbank_destiny_name', '')
    }
  }, [cashbankDestityId])

  // const getInfoRuc = useMutation({
  //   mutationFn: async (ruc: string) => {
  //     const result = await getNameByRuc(ruc)
  //     return result
  //   },
  //   onSuccess: (data) => {
  //     form.setFieldValue('legal_name', data.name)
  //   },
  // })

  const createMt = useMutation({
    mutationFn: async (data: CreateRequirementTransferDto) => {
      const result =
        await viewClient.api.view.requirement.create_transfer.$post({
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

  const onFinish = (values: CreateRequirementTransferDto) => {
    createMt.mutate({
      ...values,
    })
  }

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
          name="rq-create-form-transfer"
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
            <Form.Item label="Tipo" className="" rules={[{ required: true }]}>
              <Select placeholder="Tipo" value={type} onChange={changeType}>
                <Select.Option value={REQUIERMENT_TYPE.SIMPLE}>
                  SIMPLE
                </Select.Option>
                <Select.Option value={REQUIERMENT_TYPE.TRANSFER}>
                  TRANSFERENCIA
                </Select.Option>
                <Select.Option value={REQUIERMENT_TYPE.SUPPLIER}>
                  PROVEEDOR
                </Select.Option>
                <Select.Option value={REQUIERMENT_TYPE.LIQUIDATION}>
                  LIQUIDACION
                </Select.Option>
              </Select>
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

            <Form.Item
              label="CajaNombre"
              name={'cashbank_origin_name'}
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

            <Form.Item
              label="CajaNombre"
              name={'cashbank_destiny_name'}
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
            <Form.Item label="Caja Origen" name={'cashbank_origin'}>
              <Select placeholder="Caja">
                {cashBanks?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Caja Destino" name={'cashbank_destiny'}>
              <Select placeholder="Caja">
                {cashBanks?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item labelCol={{ span: 4 }} className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={createMt.isPending}
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
