import { Button, Form, Input, Select } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { createMenuReport } from '@/data/maintenance/MenuReport/sdk'
import { MenuReportShowIn } from '@/data/maintenance/MenuReport/showIn/showIn'
import { IReport } from '@/data/reports/types/report'
const { Option } = Select
export const CreateForm: React.FC<{
  menuReport: IReport | null
  setMenuReport: Dispatch<SetStateAction<IReport | null>>
  showUnsign?: boolean
  onClose: () => void
  reload: () => void
}> = ({ onClose, reload, setMenuReport }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: IReport) => {
    try {
      await createMenuReport(values)

      const idNot = toast.loading(
        'Creando reporte de menú ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Reporte de menú creado',
        ...NOTIFICATION.updateLoading,
      })
      setMenuReport(null)
      form.resetFields()
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Form
      form={form}
      name="createMenuReport"
      onFinish={onFinish}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="rpt_name"
        label="Nombre"
        rules={[
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="rpt_url" label="URL">
        <Input />
      </Form.Item>
      <Form.Item name="rpt_token" label="Token ">
        <Input />
      </Form.Item>
      <Form.Item
        name="key_report"
        label="Key Report"
        rules={[
          {
            max: 50,
            message: 'El Key_report debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="key_workspc"
        label="Key Workspace"
        rules={[
          {
            max: 50,
            message: 'El key_workspc debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="priority"
        label="Prioridad"
        rules={[
          {
            validator: async (_, value) => {
              if (!isNaN(Number(value))) {
                return Promise.resolve()
              }
              return Promise.reject('Prioridad debe ser un número')
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="show_in" label="Mostrar en: ">
        <Select>
          <Option key={MenuReportShowIn.Todos} value={MenuReportShowIn.Todos}>
            Todos
          </Option>
          <Option key={MenuReportShowIn.App} value={MenuReportShowIn.App}>
            App
          </Option>
          <Option key={MenuReportShowIn.Web} value={MenuReportShowIn.Web}>
            Web
          </Option>
        </Select>
      </Form.Item>

      <Form.Item className="text-right">
        <Button type="primary" htmlType="submit">
          Crear
        </Button>
      </Form.Item>
    </Form>
  )
}
