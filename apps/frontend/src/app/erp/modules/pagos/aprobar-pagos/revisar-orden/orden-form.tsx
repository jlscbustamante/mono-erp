import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import {
  AdmPaymentOrderInsert,
  AdmPaymentOrderSelect,
  ORDER_PAYMENT_STATUS,
} from '@types'
import { Form, Input, InputNumber, Select } from 'antd'
import dayjs from 'dayjs'
import { CompanySelectForm } from '../../../requerimientos/components/company-select'

type T = keyof AdmPaymentOrderInsert

export const CreateOrderForm = ({
  order,
}: {
  order: AdmPaymentOrderSelect
}) => {
  const [form] = Form.useForm()
  return (
    <div>
      <div className="bg-white p-3 rounded-md">
        <Form
          disabled={order.status != ORDER_PAYMENT_STATUS.REGISTERED}
          name="req:create-order"
          form={form}
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          className="grid grid-cols-[400px_400px_1fr] gap-x-3"
          initialValues={order}
        >
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies T}
          >
            <CompanySelectForm />
          </Form.Item>
          <Form.Item
            label="Operación"
            className="mb-1"
            name={'operation' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha carga"
            className="w-[440px] ml-auto mb-1"
            name={'payment_at' satisfies T}
          >
            <CustomDatePicker
              className="w-full"
              props={{
                minDate: dayjs(new Date()),
              }}
            />
          </Form.Item>
          <Form.Item
            label="Cuenta"
            className="mb-1"
            name={'bankaccount_number' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tipo de cuenta"
            className="mb-1"
            name={'bankaccount_type' satisfies T}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Moneda"
            className="w-[440px] ml-auto mb-1"
            name={'money' satisfies T}
          >
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Banco"
            className="mb-1"
            name={'bankaccount_name' satisfies T}
          >
            <Input />
          </Form.Item>
          <div></div>
          <Form.Item
            label="Importe a cargar"
            className="w-[440px] ml-auto mb-1"
            name={'amount' satisfies T}
          >
            <InputNumber className="w-full" readOnly />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
