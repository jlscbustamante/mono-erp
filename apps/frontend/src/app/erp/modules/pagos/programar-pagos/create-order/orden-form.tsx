import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import { CompanySelectForm } from '../../../requerimientos/components/company-select'

export const CreateOrderForm = () => {
  return (
    <div>
      <div className="bg-white p-3 rounded-md">
        <Form
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          className="grid grid-cols-[400px_400px_1fr] gap-x-3"
        >
          <Form.Item label="Empresa" className="mb-1">
            <CompanySelectForm />
          </Form.Item>
          <Form.Item label="Operación" className="mb-1">
            <Input />
          </Form.Item>
          <Form.Item label="Fecha carga" className="w-[440px] ml-auto mb-1">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Cuenta" className="mb-1">
            <Input />
          </Form.Item>
          <Form.Item label="Tipo de cuenta" className="mb-1">
            <Select>
              <Select.Option>Cuenta 1</Select.Option>
              <Select.Option>Cuenta 1</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Moneda" className="w-[440px] ml-auto mb-1">
            <Input />
          </Form.Item>
          <Form.Item label="Banco" className="mb-1">
            <Select>
              <Select.Option>Banco 1</Select.Option>
              <Select.Option>Banco 2</Select.Option>
            </Select>
          </Form.Item>
          <div></div>
          <Form.Item
            label="Informe a cargar"
            className="w-[440px] ml-auto mb-1"
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
