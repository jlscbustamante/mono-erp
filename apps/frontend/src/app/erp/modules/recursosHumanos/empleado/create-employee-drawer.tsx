import { rhApi } from '@/lib/api/rh'
import { filterSelectForm } from '@/utils'
import { useSucursales } from '@/views/products/components/stock/hooks/useSucursales'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import dayjs from 'dayjs'
import { atom, useAtom } from 'jotai'
import { RhEmployee } from 'pizzadb'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useFilterEmployees } from './state'

const controlAtom = atom<boolean>(false)

export const useCreateEmployee = () => {
  const [control, setControl] = useAtom(controlAtom)

  const close = () => setControl(false)
  const open = () => setControl(true)

  return {
    isOpen: control,
    open,
    close,
  }
}

export const CreateEmployeeDrawer = () => {
  const { isOpen, close } = useCreateEmployee()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [form] = Form.useForm()
  const { refetch } = useFilterEmployees()
  const query = useSucursales()
  const queryJobs = useQuery({
    queryKey: ['jobs'],
    queryFn: () => {
      return rhApi.getJobsTitle()
    },
    staleTime: 1000 * 60 * 1,
  })

  const jobtitleId = Form.useWatch('jobtitle_id', form)

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])

      return false
    },
    fileList,
  }

  const createEmployeeMt = useMutation({
    mutationFn: (data: FormData) => rhApi.createEmployee(data),
    onSuccess: () => {
      refetch()
      form.resetFields()
      close()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = (values: Partial<Record<keyof RhEmployee, any>>) => {
    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        if (key == 'birthday_at') {
          const date = (value as dayjs.Dayjs).format('YYYY-MM-DD')
          formData.append(key, date)
        } else if (key == 'pic_photo') {
          // formData.append(key, value.file)
        } else {
          formData.append(key, value)
        }
      }
    }

    createEmployeeMt.mutate(formData)
  }

  const config = {
    rules: [{ required: true }],
  }

  useEffect(() => {
    const jobfounded = queryJobs.data?.find((el) => el.id == jobtitleId)
    if (jobfounded) {
      form.setFieldsValue({
        jobtitle_name: jobfounded.name,
      })
    } else {
      form.setFieldsValue({
        jobtitle_name: '',
      })
    }
  }, [jobtitleId])

  return (
    <Drawer open={isOpen} onClose={close} width={500} title="Crear empleado">
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        name="employee"
        onFinish={handleSubmit}
        initialValues={
          {
            doc_type: 'DNI',
            birthday_at: dayjs(),
            gender: 'M',
            status: '1',
          } satisfies Partial<Record<keyof RhEmployee, any>>
        }
      >
        <Form.Item name="first_name" label="Nombres" {...config}>
          <Input placeholder="Nombres" />
        </Form.Item>
        <Form.Item name="last_name" label="Apellidos" {...config}>
          <Input placeholder="Apellidos" />
        </Form.Item>
        <Form.Item name="doc_type" label="Tipo de documento">
          <Select>
            <Select.Option value="DNI">DNI</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={'doc_number'} label="Número de doc." {...config}>
          <Input placeholder="Número de documento" />
        </Form.Item>
        <Form.Item name="phone" label="Teléfono">
          <Input placeholder="Teléfono" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="birthday_at" label="Fecha de nacimiento">
          <DatePicker placeholder="Fecha de nacimiento" allowClear={false} />
        </Form.Item>
        <Form.Item name="gender" label="Genero">
          <Select>
            <Select.Option value="F">Femenino</Select.Option>
            <Select.Option value="M">Masculino</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="jobtitle_id" label="Cargo">
          <Select placeholder="Cargo">
            {queryJobs.data?.map((el) => {
              return (
                <Select.Option key={el.id} value={el.id}>
                  {el.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item name="jobtitle_name" label="Cargo" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item name="job_mode" label="Modo de trabajo">
          <Input placeholder="Modo de trabajo" />
        </Form.Item>
        <Form.Item name="pic_photo" label="Foto" className="hidden">
          <Upload maxCount={1} {...props} listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item name="sucursal_id" label="Sucursal">
          <Select showSearch filterOption={filterSelectForm} allowClear={true}>
            {query.data?.map((el) => {
              return (
                <Select.Option key={el.code} value={el.code}>
                  {el.name}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Estado">
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="">
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={createEmployeeMt.isPending}
            >
              Guardar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
