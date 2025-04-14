import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { CompanySelect, MoveCashSelect, SupplierSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { REQUIREMENT_TYPE_DOCUMENT } from '@view'
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Select,
} from 'antd'
import { Plus } from 'lucide-react'

export function CrearFactura() {
  return (
    <div className="grid gap-1 grid-cols-2">
      <DatosPrincipales />
      <DatosProveedor />
      <CategoriaGasto />
    </div>
  )
}

const DatosPrincipales = () => {
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
    console.log('select : ', supplier)
    // if (supplier) {
    //   form.setFieldValue('legal_name', supplier.legal_name)
    //   form.setFieldValue('supplier', supplier.id)
    // } else {
    //   form.setFieldValue('legal_name', undefined)
    //   form.setFieldValue('supplier', undefined)
    //   messageApi.error('Proveedor no encontrado')
    // }
  }

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      {contextHolder}
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Empresa" className="mb-1">
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
          >
            <Input.TextArea placeholder="..." rows={1} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Tipo doc" className="mb-1">
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
          <Form.Item label="N° doc" className="mb-1">
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

const CategoriaGasto = () => {
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

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

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      {contextHolder}
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Categoría de gasto
      </h3>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Monto" className="mb-1">
            <Select placeholder="Monto">
              {companies?.map((company) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1">
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
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Tiene retencion" className="mb-1">
            <Checkbox />
          </Form.Item>
          <Form.Item label="Retencion" className="mb-1">
            <Input placeholder="0.00" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Categoria">
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
          <Form.Item label="Centro de costo">
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
          <Button type="primary">Guardar</Button>
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
