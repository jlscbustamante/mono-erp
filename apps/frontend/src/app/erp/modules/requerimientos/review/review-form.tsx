import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { PATHS } from '@/const/paths'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import {
  CashBankSelect,
  CompanySelect,
  CostCenterSelecet,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  REQUIREMENT_TYPE_DOCUMENT,
  RequirementDetail,
  UpdateRequirementDto,
} from '@view'
import { Button, Divider, Form, Input, InputNumber, Select } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

export function ReviewForm({ data }: { data: RequirementDetail }) {
  const [form] = Form.useForm()

  const supplierId = Form.useWatch('globalSupplierId', form)
  const costCenterId = Form.useWatch('globalCostCenterId', form)
  const cashBankId = Form.useWatch('cashBankId', form)

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
      form.setFieldValue('globalCostCenterName', costCenter.costcenter)
    } else {
      form.setFieldValue('globalCostCenterName', undefined)
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

  useEffect(() => {
    const cashBank = cashBanks?.find((el) => el.id == cashBankId)
    if (cashBank) {
      form.setFieldValue('cashBankName', cashBank.cashbank)
    } else {
      form.setFieldValue('cashBankName', '')
    }
  }, [cashBankId])

  const saveAndApproveMt = useMutation({
    mutationFn: async (data: UpdateRequirementDto) => {
      const result = await viewClient.api.view.requirement.approve.$post({
        json: data,
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

  const onFinish = (values: UpdateRequirementDto) => {
    saveAndApproveMt.mutate(values)
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
          name="rq-create-form"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          form={form}
          className="w-[800px]"
          initialValues={
            {
              globalId: data.globalId,
              globalCompanyId: data.companyId,
              globalCostCenterId: data.costCenterId,
              globalCostCenterName: data.costCenterName,
              globalDescription: data.globalDescription,
              globalDocumentType: data.documentType,
              globalDocumentNumber: data.documentNumber,
              globalSupplierId: data.supplierId,
              globalSupplierName: data.supplierName,
              globalSupplierRuc: data.supplierRuc,

              amount: data.amount,
              cashBankId: data.cashBankId ?? undefined,
              cashBankName: data.cashBankName ?? undefined,
              expiresAt: data.expiresAt ?? undefined,
              globalAmount: data.globalAmount,

              id: data.id,
              createdBy: data.createdBy,
              // quota: 1 ,
            } satisfies UpdateRequirementDto
          }
        >
          <Form.Item name={'globalSupplierRuc'} className="hidden">
            <Input />
          </Form.Item>
          <Form.Item name={'globalSupplierName'} className="hidden">
            <Input />
          </Form.Item>
          <Form.Item className="hidden" name={'globalCostCenterName'}>
            <Input />
          </Form.Item>
          <Form.Item className="hidden" name={'cashBankName'}>
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
              className=""
              name="globalCompanyId"
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
            <Form.Item label="Centro de costo" name="globalCostCenterId">
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
            <Form.Item label="Proveedor" name="globalSupplierId">
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
          </div>
          <div>
            <Form.Item
              label="Detalle"
              labelAlign="left"
              labelCol={{ span: 4 }}
              name="globalDescription"
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
              name="globalDocumentType"
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
            <Form.Item label="N° doc." name="globalDocumentNumber">
              <Input />
            </Form.Item>
          </div>

          <Divider />
          <h5>Datos del pago:</h5>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item
              label="Monto"
              name="globalAmount"
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
              label="Caja"
              name={'cashBankId'}
              rules={[{ required: true }]}
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
            <Form.Item label="Vencimiento" name={'expiresAt'}>
              <CustomDatePicker />
            </Form.Item>
            <Form.Item label="Valor quota" name={'amount'}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="N° cuota" labelCol={{ span: 4 }}>
              <InputNumber readOnly min={1} />
            </Form.Item>
          </div>
          <Divider />
          <div className="grid grid-cols-2 gap-2">
            <Form.Item name={'createdBy'} label="Creado por">
              <Input readOnly />
            </Form.Item>
          </div>
          <Form.Item labelCol={{ span: 4 }} className="flex justify-end">
            <Button danger type="primary">
              Rechazar
            </Button>
            <Button type="primary" htmlType="submit" className="ml-2">
              Aprobar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
