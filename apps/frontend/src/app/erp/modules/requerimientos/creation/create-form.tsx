import { PATHS } from '@/const/paths'
import { UploadOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Tabs,
  Upload,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export function CreationForm() {
  const navigate = useNavigate()
  const [tabKey, setTabKey] = useState<string>('1')
  return (
    <div className="flex justify-center gap-3">
      <div>
        <div
          className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer inline-flex"
          onClick={() => navigate(PATHS.erp.modulos.requerimientos.solicitados)}
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
          <Form.Item label="Descripcion">
            <Input.TextArea placeholder="Descripcion" rows={4} />
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
          <Form.Item label="Archivos">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
      <div>
        <div className="mt-1 mb-3 text-slate-600 items-center hover:text-slate-700 cursor-pointer invisible">
          <ArrowLeft className="" size={16} />
          Volver
        </div>
        <div className="border border-solid border-slate-300 rounded-md p-6 shrink-0 w-[600px] flex flex-col">
          <Tabs
            className="flex-1"
            activeKey={tabKey}
            onChange={(val) => {
              setTabKey(val)
            }}
            items={[
              {
                key: '1',
                label: 'Un solo pago',
                children: <SinglePaymentForm />,
              },
              {
                key: '2',
                label: 'Cuotas',
                children: <PaymentForm />,
              },
            ]}
          />
          <div className="flex justify-end mt-3">
            <Button
              type="primary"
              onClick={() => {
                navigate(PATHS.erp.modulos.requerimientos.solicitados)
              }}
            >
              Crear
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface Quota {
  quota: number
  expiresAt: string
  amount: number
}

const PaymentForm = () => {
  const [amount, setAmount] = useState(1)
  const [countQuotas, setCountQuotas] = useState(1)
  const [quotas, setQuotas] = useState<Quota[]>([
    {
      quota: 1,
      expiresAt: dayjs().format('YYYY-MM-DD'),
      amount: 1,
    },
  ])

  useEffect(() => {
    const eachQuota = amount / countQuotas
    const newquotas = Array.from({ length: countQuotas }, (_, i) => {
      return {
        quota: i + 1,
        expiresAt: dayjs().add(i, 'month').format('YYYY-MM-DD'),
        amount: +eachQuota.toFixed(2),
      }
    })
    setQuotas(newquotas)
  }, [amount, countQuotas])
  return (
    <div>
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        className="max-w-96"
      >
        <Form.Item label="Monto">
          <InputNumber
            min={1}
            className="w-40"
            value={amount}
            onChange={(e) => {
              if (e) setAmount(e)
            }}
          />
        </Form.Item>
        <Form.Item label="Cuotas">
          <InputNumber
            className="w-40"
            min={1}
            value={countQuotas}
            onChange={(e) => {
              if (e) setCountQuotas(e)
            }}
          />
        </Form.Item>
      </Form>
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
          ] satisfies ColumnsType<Quota>
        }
      />
    </div>
  )
}

const SinglePaymentForm = () => {
  const [hasRetention, setHasRetention] = useState(false)
  return (
    <Form
      labelCol={{ span: 10 }}
      wrapperCol={{ span: 14 }}
      className="max-w-96"
    >
      <Form.Item label="Monto">
        <Input placeholder="0.00" />
      </Form.Item>
      <Form.Item label="Retencion">
        <Checkbox
          checked={hasRetention}
          onChange={(e) => setHasRetention(e.target.checked)}
        />
      </Form.Item>
      <Form.Item label="Retencion" className={hasRetention ? '' : 'hidden'}>
        <Input placeholder="0.00" />
      </Form.Item>
    </Form>
  )
}
