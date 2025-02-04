import { PATHS } from '@/const/paths'
import { getNameByRuc } from '@/data/requests/sdk'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CashBankSelect, CompanySelect, CostCenterSelecet } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { REQUIREMENT_TYPE_DOCUMENT } from '@view'
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
import { useNavigate } from 'react-router'

export function CreationForm() {
  const [form] = Form.useForm()

  const hasRetention = Form.useWatch('hasRetention', form)

  const { data: companies } = useQuery({
    queryKey: ['rq:companies'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.companies.$get()
      const result = await request.json()
      return result.data as CompanySelect[]
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

  const getInfoRuc = useMutation({
    mutationFn: async (ruc: string) => {
      const result = await getNameByRuc(ruc)
      return result
    },
    onSuccess: (data) => {
      form.setFieldValue('legal_name', data.name)
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

  const onFinish = (values: unknown) => {
    console.log('create : ', values)
  }

  const navigate = useNavigate()
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
          initialValues={{
            quota: 1,
            description: '',
            amount: 1,
            hasRetention: false,
          }}
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
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="RUC proveedor"
              name="ruc"
              rules={[{ required: true }]}
            >
              <Input.Search
                placeholder="RUC proveedor"
                loading={getInfoRuc.isPending}
                onSearch={(ruc) => {
                  getInfoRuc.mutate(ruc.trim())
                }}
              />
            </Form.Item>
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
            <Form.Item label="Centro de costo" name="cost_center">
              <Select placeholder="Categoria">
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
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Forma de pago">
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
              <div className="flex gap-1">
                <InputNumber readOnly min={1} />
                <div className="flex gap-1 items-center">
                  <Button size="small">
                    <Plus className="w-4 text-slate-600" />
                  </Button>
                  <Button size="small">
                    <Minus className="w-4 text-slate-600" />
                  </Button>
                </div>
              </div>
            </Form.Item>
          </div>
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
