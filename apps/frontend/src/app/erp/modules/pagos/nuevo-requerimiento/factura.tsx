import { CustomCheckbox } from '@/components/ant-form/custom-checkbox'
import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import {
  CompanySelect,
  CostCenterSelecet,
  MoveCashSelect,
  SupplierSelect,
} from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AdmRequirementInsert } from '@types'
import { REQUIREMENT_TYPE_DOCUMENT } from '@view'
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { Plus } from 'lucide-react'

type R = keyof AdmRequirementInsert

export function CrearFactura() {
  const [formPrincipal] = Form.useForm()
  const [formCategoria] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const createRequirementMt = useMutation({
    mutationFn: async (data: AdmRequirementInsert) => {
      const request =
        await viewClient.api.view.payment.create_requirement.$post({
          json: data,
        })
      if (!request.ok) {
        const error = await request.json()
        throw new Error(error.message)
      }
    },
    onError: (error) => {
      messageApi.error(error.message)
    },
    onSuccess: () => {
      messageApi.success('Requerimiento creado correctamente')
      formPrincipal.resetFields()
      formCategoria.resetFields()
    },
  })

  const onSave = async () => {
    const pricipales = formPrincipal.getFieldsValue()
    const categoria = formCategoria.getFieldsValue()

    const value: AdmRequirementInsert = {
      ...pricipales,
      ...categoria,
    }
    await createRequirementMt.mutateAsync(value)
  }

  return (
    <div className="grid gap-1 grid-cols-2">
      {contextHolder}
      <DatosPrincipales
        formInstance={formPrincipal}
        messageInstance={messageApi}
      />
      <DatosProveedor />
      <CategoriaGasto
        onSave={onSave}
        formInstance={formCategoria}
        loading={createRequirementMt.isPending}
      />
    </div>
  )
}

const DatosPrincipales = ({
  formInstance,
  messageInstance,
}: {
  formInstance: FormInstance<any>
  messageInstance?: MessageInstance
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

  const { data: suppliers, refetch: _refetchSupplier } = useQuery({
    queryKey: ['rq:suppliers'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.suppliers.$get()
      const result = await request.json()
      return result.data as SupplierSelect[]
    },
  })

  const searchSupplier = (ruc: string) => {
    const supplier = suppliers?.find((el) => el.legal_number === ruc)
    if (supplier) {
      formInstance.setFieldValue('legal_name' satisfies R, supplier.legal_name)
      formInstance.setFieldValue(
        'legal_number' satisfies R,
        supplier.legal_number,
      )
      formInstance.setFieldValue('supplier_id' satisfies R, supplier.id)
    } else {
      formInstance.setFieldValue('legal_name' satisfies R, undefined)
      formInstance.setFieldValue('legal_number' satisfies R, undefined)
      formInstance.setFieldValue('supplier_id' satisfies R, undefined)
      messageInstance?.warning('Proveedor no encontrado')
    }
  }

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={formInstance}
        name="formPrincipal"
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies R}
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
            className="mb-1"
            rules={[{ required: true }]}
            name={'legal_number' satisfies R}
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
            className="mb-1"
            label="Proveedor"
            name={'legal_name' satisfies R}
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
            name={'description' satisfies R}
          >
            <Input.TextArea placeholder="..." rows={1} />
          </Form.Item>
        </div>
        <Form.Item hidden name="supplier_id">
          <Input />
        </Form.Item>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Tipo doc"
            className="mb-1"
            name={'type_document' satisfies R}
          >
            <Select placeholder="Requerimiento" filterOption={filterSelectForm}>
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
            label="N° doc"
            className="mb-1"
            name={'num_document' satisfies R}
          >
            <Input placeholder="N° doc" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Contrato">
            <Input />
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

const CategoriaGasto = ({
  onSave,
  formInstance,
  loading,
}: {
  loading: boolean
  onSave: () => void
  formInstance: FormInstance<any>
}) => {
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

  const hasRetention = Form.useWatch('has_retention', formInstance)

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Categoría de gasto
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={formInstance}
        name="formCategoria"
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Monto" className="mb-1" name={'amount' satisfies R}>
            <InputNumber className="w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1" name={'money' satisfies R}>
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Vencimiento"
            className="mb-1"
            rules={[{ required: true }]}
            name={'expires_at' satisfies R}
          >
            <CustomDatePicker />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Tiene retencion"
            className="mb-1"
            name={'has_retention' satisfies R}
          >
            <CustomCheckbox />
          </Form.Item>
          <Form.Item
            label="Retencion"
            className="mb-1"
            name={'amount_ret' satisfies R}
          >
            <Input placeholder="0.00" disabled={!(hasRetention == '1')} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Categoria" name={'movetype_id' satisfies R}>
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
          <Form.Item label="Centro de costo" name={'costcenter_id' satisfies R}>
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
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button type="primary" onClick={onSave} loading={loading}>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const DatosProveedor = () => {
  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos del proveedor
      </h3>
      <div className="ml-10 flex flex-col gap-2">
        <div className="grid grid-cols-2">
          <p>Proveedor: Tienda Rosita SAC</p>
          <p>RUC: 87654321</p>
        </div>
        <div className="flex items-center gap-2">
          <span>Cuenta: 12345678</span>{' '}
          <Button size="small" type="primary">
            <Plus />
          </Button>
        </div>
        <div>
          <p>CCI: 121344444444</p>
        </div>
        <div>
          <p>Tipo: Cuenta corriente</p>
        </div>
        <div>
          <p>Banco : BCP</p>
        </div>
      </div>
    </div>
  )
}
