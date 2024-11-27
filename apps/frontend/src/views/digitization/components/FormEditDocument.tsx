import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/digitization/sdk'
import { IAdmFile } from '@/data/digitization/types'
import { safeAny } from '@/utils'

export const FormEditDocument: React.FC<{
  selectedFile: IAdmFile
  setSelectedFile: safeAny
}> = ({ selectedFile, setSelectedFile }) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }
  const handlerUpdate = async () => {
    try {
      await sdk.update(selectedFile)
      toast.info('Actualizado correctamente', NOTIFICATION.success)
      setSelectedFile(null)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return (
    <Form {...layout}>
      <Form.Item label="Id">
        <Input value={selectedFile.id} readOnly />
      </Form.Item>
      <Form.Item label="Tipo">
        <Select
          value={selectedFile.doc_type}
          onChange={(val) => {
            setSelectedFile({
              ...selectedFile,
              doc_type: val,
            })
          }}
        >
          <Select.Option value="FACTURA">FACTURA</Select.Option>
          <Select.Option value="BOLETA">BOLETA</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Fecha">
        <DatePicker
          value={dayjs(selectedFile.doc_date)}
          aria-readonly={true}
          inputReadOnly
          allowClear={false}
        />
      </Form.Item>
      <Form.Item label="N° Doc">
        <Input
          value={selectedFile.doc_number}
          onChange={(e) =>
            setSelectedFile({ ...selectedFile, doc_number: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item label="Doc url">
        <Input value={selectedFile.doc_url} readOnly />
      </Form.Item>
      <Form.Item label="Id de requerimiento">
        <InputNumber value={selectedFile.doc_request} readOnly />
      </Form.Item>
      <Form.Item label="Descripcion">
        <TextArea
          rows={4}
          cols={10}
          autoSize={true}
          value={selectedFile.doc_description}
          onChange={(e) => {
            setSelectedFile({
              ...selectedFile,
              doc_description: e.target.value,
            })
          }}
        />
      </Form.Item>
      <Form.Item label="Creado por">
        <Input value={selectedFile.created_by} readOnly />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handlerUpdate}>
          Guardar cambios
        </Button>
      </Form.Item>
    </Form>
  )
}
