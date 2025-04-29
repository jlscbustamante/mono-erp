import { CustomDatePicker } from '@/components/ant-form/custom-datepicker'
import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import {
  AdmPaymentOrderInsert,
  AdmPaymentOrderSelect,
  FinCashbankSelect,
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
  const query_cash_bank = useQuery({
    queryKey: ['req:cash-banks'],
    queryFn: async () => {
      const req = await viewClient.api.view.cashbank.$get()
      const body = await req.json()
      if (!req.ok) {
        throw new Error(body.message ?? 'Error al cargar los bancos')
      }
      return body.data as FinCashbankSelect[]
    },
  })

  return (
    <div>
      <div className="bg-white p-3 rounded-md">
        <Form
          // disabled={order.status != ORDER_PAYMENT_STATUS.REGISTERED}
          disabled={true}
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
                allowClear: false,
              }}
            />
          </Form.Item>
          <Form.Item
            label="Cuenta"
            className="mb-1"
            name={'cashbank_id' satisfies T}
            rules={[{ required: true }]}
          >
            {/* <Input /> */}
            <Select
              className="w-64"
              placeholder="Tiendas"
              filterOption={filterSelectForm}
              showSearch={true}
              allowClear
            >
              {query_cash_bank.data
                ?.filter((el) => el.type_cash == 3)
                ?.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.cashbank}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name={'bankaccount_number' satisfies T} hidden>
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
