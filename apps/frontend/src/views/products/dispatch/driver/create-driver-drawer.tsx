import { createDriver } from '@/data/hex/inventory'
import { CreateDriverDto } from '@/data/hex/types'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import { useFilterDrivers } from './state'

const createDriverAtom = atom<boolean>({
  key: 'createDriverAtom',
  default: false,
})

export const useCreateDriverDrawer = () => {
  const [isOpen, setIsOpen] = useRecoilState(createDriverAtom)

  return {
    isOpen: isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

export const CreateDriverDrawer = () => {
  const { isOpen, close } = useCreateDriverDrawer()

  const [form] = Form.useForm<CreateDriverDto>()
  const { refetch } = useFilterDrivers()

  const createDriverMt = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      refetch()
      close()
      form.resetFields()
    },
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
  })

  const onFinish = async (values: CreateDriverDto) => {
    createDriverMt.mutate({
      ...values,
      transportName: values.transportCompanyName,
    })
  }

  const onValuesChange = (changedValues: any) => {
    if (changedValues.transportPlateNumber) {
      let modifiedValue = changedValues.transportPlateNumber.toUpperCase()
      modifiedValue = modifiedValue.replace(/[^a-zA-Z0-9]/g, '')

      form.setFieldsValue({
        transportPlateNumber: modifiedValue,
      })
    }
  }

  return (
    <Drawer open={isOpen} onClose={close} title="Nuevo transporte" width={500}>
      <Form
        onValuesChange={onValuesChange}
        initialValues={
          {
            driverTypeDoc: 'DNI',
            status: '1',
            transportName: '',
            transportCompanyName: '',
            transportPlateNumber: '',
            driverDocNumber: '',
            driverFirstName: '',
            driverLastName: '',
            driverLicenseNumber: '',
            carrierDocNumber: '',
          } satisfies CreateDriverDto
        }
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
      >
        <Form.Item name={'driverFirstName'} label={'Nombres'}>
          <Input />
        </Form.Item>
        <Form.Item name={'driverLastName'} label={'Apellidos'}>
          <Input />
        </Form.Item>
        <Form.Item name={'driverLicenseNumber'} label={'N° de licencia'}>
          <Input />
        </Form.Item>
        <Form.Item name={'driverTypeDoc'} label={'Tipo de doc.'}>
          <Select>
            <Select.Option value="DNI">DNI</Select.Option>
            <Select.Option value="RUC">RUC</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={'driverDocNumber'} label={'N° de doc.'}>
          <Input />
        </Form.Item>
        <Form.Item name={'transportCompanyName'} label="Razon social">
          <Input />
        </Form.Item>
        <Form.Item name={'carrierDocNumber'} label={'RUC'}>
          <Input />
        </Form.Item>

        <Form.Item name={'transportName'} label="Compañia" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item name={'transportPlateNumber'} label={'Placa'}>
          <Input />
          {/* <InputNumber /> */}
        </Form.Item>

        <Form.Item name={'status'} label={'Estado'}>
          <Select>
            <Select.Option value="1">Activo</Select.Option>
            <Select.Option value="0">Inactivo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="text-right">
          <Button
            type="primary"
            htmlType="submit"
            loading={createDriverMt.isPending}
          >
            Crear
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
