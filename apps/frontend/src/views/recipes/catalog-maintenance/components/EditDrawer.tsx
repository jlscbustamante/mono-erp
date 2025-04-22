import { Drawer, Form, Input, InputNumber, Select, Button, Space } from 'antd'
import { useEffect } from 'react'

type EditDrawerField = {
  name: string
  label: string
  type: 'text' | 'number' | 'select'
  required?: boolean
  options?: { value: any; label: string }[] // solo para selects
}

interface EditDrawerProps<T> {
  open: boolean
  onClose: () => void
  initialValues: Partial<T> | null
  fields: EditDrawerField[]
  onSubmit: (values: Partial<T>) => void
  loading?: boolean
  title?: string
}

export function EditDrawer<T>({
  open,
  onClose,
  initialValues,
  fields,
  onSubmit,
  loading,
  title = 'Editar',
}: EditDrawerProps<T>) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
      onClose()
    })
  }

  return (
    <Drawer
      title={title}
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
    >
      <Form layout="vertical" form={form}>
        {fields.map((field) => {
          const rules = field.required ? [{ required: true, message: 'Este campo es obligatorio' }] : []

          switch (field.type) {
            case 'text':
              return (
                <Form.Item key={field.name} name={field.name} label={field.label} rules={rules}>
                  <Input />
                </Form.Item>
              )
            case 'number':
              return (
                <Form.Item key={field.name} name={field.name} label={field.label} rules={rules}>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              )
            case 'select':
              return (
                <Form.Item key={field.name} name={field.name} label={field.label} rules={rules}>
                  <Select>
                    {field.options?.map(opt => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            default:
              return null
          }
        })}

        <Space style={{ display: 'flex', justifyContent: 'end' }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Guardar
          </Button>
        </Space>
      </Form>
    </Drawer>
  )
}
