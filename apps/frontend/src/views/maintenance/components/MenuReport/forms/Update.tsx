import { Button, Form, Input, Select } from 'antd'
import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import { updateMenuReport } from '@/data/maintenance/MenuReport/sdk'
import { MenuReportShowIn } from '@/data/maintenance/MenuReport/showIn/showIn'
import { ICreateMenuReport, IReport } from '@/data/reports/types'
const { Option } = Select
export const UpdateForm: React.FC<{
  menuReport: ICreateMenuReport | null
  setMenuReport: Dispatch<SetStateAction<IReport | null>>
  reload: () => void
  onClose: () => void
}> = ({ setMenuReport, menuReport, onClose, reload }) => {
  const [form] = Form.useForm()

  const onFinish = async (values: IReport) => {
    console.log(values)
    try {
      await updateMenuReport(menuReport?.id, values)
      const idNot = toast.loading(
        'Actualizando reporte de menú ...',
        NOTIFICATION.loading,
      )
      toast.update(idNot, {
        render: 'Reporte de menú actualizado',
        ...NOTIFICATION.updateLoading,
      })
      form.resetFields()
      setMenuReport(null)
      reload()
      onClose()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }
  return (
    <Form
      form={form}
      name="updateMenuReport"
      onFinish={onFinish}
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 90 }}
    >
      <Form.Item
        name="id"
        label="ID"
        initialValue={menuReport ? menuReport.id : ''}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="rpt_name"
        label="Nombre"
        initialValue={menuReport ? menuReport.rpt_name : ''}
        rules={[
          {
            max: 150,
            message: 'El Nombre debe tener como máximo 150 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="rpt_url"
        label="URL"
        initialValue={menuReport ? menuReport.rpt_url : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="rpt_token"
        label="Token"
        initialValue={menuReport ? menuReport.rpt_token : ''}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="key_report"
        label="Key Report"
        initialValue={menuReport ? menuReport.key_report : ''}
        rules={[
          {
            max: 50,
            message: 'El Tipo ID debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="key_workspc"
        label="Key Workspace"
        initialValue={menuReport ? menuReport.key_workspc : ''}
        rules={[
          {
            max: 50,
            message: 'El Tipo ID debe tener como máximo 50 caracteres',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="priority"
        label="Prioridad"
        initialValue={menuReport ? menuReport.priority : ''}
        rules={[
          {
            validator: async (_, value) => {
              if (!isNaN(Number(value))) {
                return Promise.resolve()
              }
              return Promise.reject('Prioridad ser un número')
            },
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={menuReport ? menuReport.show_in : ''}
        name="show_in"
        label="Mostrar en: "
      >
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
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
