import { viewClient } from '@/lib/rpc'
import { CashBankSelect, CompanySelect } from '@pizzadb'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AdmReqNondocsInsert } from '@types'
import { Button, Form, Input, InputNumber, message, Select } from 'antd'
import { toast } from 'react-toastify'
export function Anticipo() {
  return (
    <div>
      <AnticipoForm />
    </div>
  )
}

type T = keyof AdmReqNondocsInsert

const AnticipoForm = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const create_mt = useMutation({
    mutationFn: async (data: AdmReqNondocsInsert) => {
      const request =
        await viewClient.api.view.nondoc.requirement.prepayment.$post({
          json: data,
        })
      const result = await request.json()
      if (!request.json) {
        throw new Error(result.message ?? 'Error al crear el requerimiento')
      }
    },
    onError: (err) => {
      toast.error(err.message ?? 'Error al crear el requerimiento')
    },
    onSuccess: () => {
      messageApi.success('Requerimiento creado correctamente')
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

  const { data: cashBanks } = useQuery({
    queryKey: ['rq:cashBanks'],
    queryFn: async () => {
      const request =
        await viewClient.api.view.requirement.resource.cashBanks.$get()
      const result = await request.json()
      return result.data as CashBankSelect[]
    },
  })

  const handle_save = async () => {
    const values = form.getFieldsValue() as AdmReqNondocsInsert
    await create_mt.mutateAsync(values)
    form.resetFields()
  }

  return (
    <div className="bg-white rounded-md p-3 max-w-[900px]">
      {contextHolder}
      <h3 className="font-sans font-normal text-lg mb-3 ml-10">
        Datos principales
      </h3>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onFinish={handle_save}
        name="rq:create_anticipo"
      >
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Empresa"
            className="mb-1"
            name={'company_id' satisfies T}
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
            label="Cuenta origen"
            className="mb-1"
            rules={[{ required: true }]}
            name={'cashbank_source_id' satisfies T}
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
            name={'cashbank_target_id' satisfies T}
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
            name={'description' satisfies T}
          >
            <Input.TextArea placeholder="..." rows={1} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Monto" className="mb-1" name={'amount' satisfies T}>
            <InputNumber className="w-full" placeholder="0.00" />
          </Form.Item>
          <Form.Item label="Moneda" className="mb-1" name={'money' satisfies T}>
            <Select placeholder="Moneda">
              <Select.Option value="PEN">S/.</Select.Option>
              <Select.Option value="USD">$</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item className="text-right" wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            loading={create_mt.isPending}
            // onClick={handle_save}
            htmlType="submit"
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
