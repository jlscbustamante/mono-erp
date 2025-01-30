import { PATHS } from '@/const/paths'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router'

export function CreationForm() {
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
          labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          className="w-[800px]"
        >
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Empresa" className="">
              <Select placeholder="Empresa"></Select>
            </Form.Item>
            {/* <Form.Item label="Tipo" className="">
              <Select placeholder="Tipo">
                <Select.Option>Simple</Select.Option>
                <Select.Option>Transferencia</Select.Option>
                <Select.Option>Proveedores</Select.Option>
              </Select>
            </Form.Item> */}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="RUC proveedor">
              <Input.Search placeholder="RUC proveedor" />
            </Form.Item>
            <Form.Item label="R. social">
              <Input />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Detalle" labelAlign="left" labelCol={{ span: 4 }}>
              <Input.TextArea placeholder="Descripcion" rows={2} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Tipo doc.">
              <Select placeholder="Requerimiento">
                <Select.Option>Descripcion del requerimiento</Select.Option>
                <Select.Option>Descripcion 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="N° doc.">
              <Input />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Categoria">
              <Select placeholder="Categoria">
                <Select.Option>Descripcion del requerimiento</Select.Option>
                <Select.Option>Descripcion 2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Centro de costo">
              <Select placeholder="Categoria">
                <Select.Option>Descripcion del requerimiento</Select.Option>
                <Select.Option>Descripcion 2</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Divider />
          <h5>Datos del pago:</h5>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Monto">
              <Input placeholder="0.00" />
            </Form.Item>
            <Form.Item label="Caja">
              <Select placeholder="Caja"></Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Formo de pago">
              <Select placeholder="pago"></Select>
            </Form.Item>
            <Form.Item label="Vencimiento">
              <Select placeholder="Caja"></Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Form.Item label="Tipo de retencion">
              <Checkbox />
            </Form.Item>
            <Form.Item label="Retencion">
              <InputNumber placeholder="0.0" />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="N° cuota" labelCol={{ span: 4 }}>
              <div className="flex gap-1">
                <InputNumber />
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
            <Button type="primary">Crear</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
