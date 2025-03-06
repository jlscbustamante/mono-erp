import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AiOutlineUpload } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/digitization/sdk'
import { IAdmFile } from '@/data/digitization/types'
import { IFilteredRequest } from '@/data/requests/types'
import { safeAny } from '@/utils'

export const FormUploadDocument: React.FC<{
  selectedRequest: IFilteredRequest
  onFinish: () => void
}> = ({ selectedRequest, onFinish }) => {
  const [file, setFile] = useState<safeAny>(null)
  const [document, setDocument] = useState<Partial<IAdmFile>>({
    doc_type: 'FACTURA',
    doc_description: '',
    doc_request: selectedRequest.id,
    doc_number: selectedRequest.num_document ?? '',
    doc_date: dayjs().format('YYYY-MM-DD'),
  })
  const [loading, setLoading] = useState(false)

  const handlerUpload = async () => {
    try {
      setLoading(true)
      if (!file) throw new Error('Seleccione un archivo')
      await sdk.upload(document, file)
      toast.success('Documento creado', NOTIFICATION.success)
      onFinish()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  }
  return (
    <Form {...layout}>
      <Form.Item label="Tipo">
        <Select
          showSearch
          value={document.doc_type}
          onChange={(e) => setDocument({ ...document, doc_type: e })}
        >
          <Select.Option value="FACTURA">FACTURA</Select.Option>
          <Select.Option value="BOLETA">BOLETA</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Fecha">
        <DatePicker
          value={dayjs(document.doc_date)}
          onChange={(e: safeAny) => {
            setDocument({ ...document, doc_date: e.format('YYYY-MM-DD') })
          }}
        />
      </Form.Item>
      <Form.Item label="N° Doc">
        <Input
          value={document.doc_number}
          onChange={(e) =>
            setDocument({ ...document, doc_number: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Id de requerimiento">
        <InputNumber value={selectedRequest.id} readOnly={true} />
      </Form.Item>
      <Form.Item label="Descripcion">
        <TextArea
          rows={3}
          cols={10}
          value={document.doc_description}
          onChange={(e) =>
            setDocument({ ...document, doc_description: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item
        label="Documento"
        valuePropName="fileList"
        // getValueFromEvent={normFile}
      >
        <Upload
          accept="application/pdf"
          maxCount={1}
          onChange={(e) => {
            setFile(e.fileList[0]?.originFileObj ?? null)
          }}
          beforeUpload={() => false}
        >
          <Button icon={<AiOutlineUpload />}>Selecciona archivo</Button>
        </Upload>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 7 }}>
        <div className="flex justify-end">
          <Button type="primary" onClick={handlerUpload} disabled={loading}>
            Guardar documento
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}
