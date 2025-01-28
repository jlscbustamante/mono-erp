import { PATHS } from '@/const/paths'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Table, Upload } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

interface Quota {
  quota: number
  expiresAt: string
  amount: number
  status: string
}

export function ReviewForm() {
  const navigate = useNavigate()

  const [quotas] = useState<Quota[]>([
    {
      quota: 1,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
      status: 'PAGADO',
    },
    {
      quota: 2,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
      status: 'PAGADO',
    },
    {
      quota: 3,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
      status: 'PAGADO',
    },
    {
      quota: 4,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
      status: 'PENDIENTE',
    },
    {
      quota: 5,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
      status: 'PENDIENTE',
    },
  ])

  return (
    <div>
      <div className="flex justify-center gap-3">
        <div>
          <div
            className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex"
            onClick={() =>
              navigate(PATHS.erp.modulos.requerimientos.solicitados)
            }
          >
            <ArrowLeft className="" size={16} />
            Volver
          </div>
          <Form
            className="border border-solid border-slate-300 rounded-md p-6 shrink-0"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ width: 600 }}
          >
            <Form.Item label="Compañia">
              <Select placeholder="Compañia"></Select>
            </Form.Item>
            <Form.Item label="Tipo">
              <Select placeholder="Tipo">
                <Select.Option>Simple</Select.Option>
                <Select.Option>Transferencia</Select.Option>
                <Select.Option>Proveedores</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Proveedor">
              <Select placeholder="Proveedor"></Select>
            </Form.Item>
            <Form.Item label="Tipo de doc">
              <Select>
                <Select.Option>Factura</Select.Option>
                <Select.Option>Boleta</Select.Option>
                <Select.Option>Ticket de salida</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Caja de banco">
              <Select placeholder="Caja de banco"></Select>
            </Form.Item>
            <Form.Item label="Cuota">
              <Input value="2/5" />
            </Form.Item>
            <Form.Item label="Monto">
              <Input value="1555.0" />
            </Form.Item>

            <Form.Item label="Archivos">
              <Upload>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item className="" wrapperCol={{ offset: 8, span: 16 }}>
              <div className="flex gap-3">
                <Button type="primary">Pagar</Button>
                <Button type="primary">Rechazar</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div>
          <div className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer invisible">
            <ArrowLeft className="" size={16} />
            Volver
          </div>
          <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 w-[600px] flex flex-col">
            <div className="text-slate-500 my-3">
              Requerimientos relacionados
            </div>
            <Table
              pagination={false}
              dataSource={quotas}
              className=""
              bordered
              size="small"
              columns={
                [
                  {
                    title: 'N° cuota',
                    dataIndex: 'quota',
                  },
                  {
                    title: 'F. vencimiento',
                    dataIndex: 'expiresAt',
                  },
                  {
                    title: 'Monto',
                    dataIndex: 'amount',
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'status',
                  },
                  {
                    render: () => {
                      return (
                        <ExternalLink
                          size={18}
                          className="text-slate-500 hover:text-blue-500 cursor-pointer"
                        />
                      )
                    },
                  },
                ] satisfies ColumnsType<Quota>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
