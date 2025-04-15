import { viewClient } from '@/lib/rpc'
import { CashBankSelect, CompanySelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, Select } from 'antd'

export function Anticipo() {
  return (
    <div>
      <AnticipoForm />
    </div>
  )
}

const AnticipoForm = () => {
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
            label="Cuenta origen"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <Select placeholder="Caja">
              {cashBanks
                // ?.filter((el) => {
                //   if (company) {
                //     return el.company_id == company
                //   }
                //   return true
                // })
                ?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Cuenta destino"
            className="mb-1"
            rules={[{ required: true }]}
          >
            <Select placeholder="Caja">
              {cashBanks
                // ?.filter((el) => {
                //   if (company) {
                //     return el.company_id == company
                //   }
                //   return true
                // })
                ?.map((cashBank) => (
                  <Select.Option key={cashBank.id} value={cashBank.id}>
                    {cashBank.cashbank}
                  </Select.Option>
                ))}
            </Select>
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
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button type="primary">Guardar</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
