import { viewClient } from '@/lib/rpc'
import { CreateSupplier } from '@/views/products/components/productItem/CreateSupplier'
import { CompanySelect, SupplierSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from 'antd'
import { Minus, Plus } from 'lucide-react'

export function Contrato() {
  return (
    <div className="grid gap-1 grid-cols-2">
      <DatosPrincipales />
      <FormaPago />
      <TerminosPago />
    </div>
  )
}

const DatosPrincipales = () => {
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
            label="Tipo de contrato"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="1">Contrato</Select.Option>
              <Select.Option value="2">Adenda</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="N° Pizza Raul" className="mb-1">
            <Input />
          </Form.Item>
          <Form.Item label="N° Proveedor" className="mb-1">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Form.Item
              label="RUC proveedor"
              className="mb-1 flex-1"
              rules={[{ required: true }]}
            >
              <Input.Search
                placeholder="RUC proveedor"
                className="w-[calc(100%_-_2rem)]"
                // loading={getInfoRuc.isPending}
                onSearch={(ruc) => {
                  searchSupplier(ruc)
                }}
                // onSearch={(ruc) => {
                //   getInfoRuc.mutate(ruc.trim())
                // }}
              />
            </Form.Item>
            <CreateSupplier
              className="absolute top-0 right-0"
              suppliers={suppliers ?? []}
              onError={(message) => {
                // messageInstance?.error(message)
              }}
              onCreate={(id, supplier, ruc) => {
                // formInstance.setFieldValue('supplier_id' satisfies R, id)
                // formInstance.setFieldValue('legal_name' satisfies R, supplier)
                // formInstance.setFieldValue('legal_number' satisfies R, ruc)
              }}
            />
          </div>
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
      </Form>
    </div>
  )
}

const TerminosPago = () => {
  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Terminos de pago
      </h3>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Monto" className="mb-1">
            <InputNumber className="w-full" placeholder="0.00" />
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
            label="Forma de pago"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option>EFECTIVO</Select.Option>
              <Select.Option>OTRO</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Frecuencia de pago" className="mb-1">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item className="mb-1" label="Vigencia">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Inicio"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Vencimiento"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button type="primary">Guardar</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const FormaPago = () => {
  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Forma de pago
      </h3>
      <div className="ml-10 flex flex-col gap-2">
        <div className="grid grid-cols-[200px_200px] gap-2">
          <p>Pagar credito</p>
          <div>
            <Switch
              className="justify-start items-start"
              checkedChildren="Si"
              unCheckedChildren="No"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="grid grid-cols-[200px_200px] gap-2">
            <p>N° cuota</p>
            <div className="space-y-2">
              <Input className="w-20" />
              <div className="flex gap-1 items-center">
                <Button
                  size="small"
                  // onClick={() => changeQuota(true)}
                  type="primary"
                >
                  <Plus className="w-4 text-white" />
                </Button>
                <Button
                  size="small"
                  // onClick={() => changeQuota(false)}
                  type="primary"
                >
                  <Minus className="w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-1">
              <Input className="w-20" />
              <InputNumber className="w-28" />
              <DatePicker className="flex-1" />
            </div>
            <div className="flex gap-1">
              <Input className="w-20" />
              <InputNumber className="w-28" />
              <DatePicker className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
