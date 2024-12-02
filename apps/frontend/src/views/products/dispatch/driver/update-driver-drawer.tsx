import { updateDriver } from '@/data/hex/inventory'
import { Driver } from '@/data/hex/types'
import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Form, Input, Select } from 'antd'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'
import { useFilterDrivers } from './state'

const updateDriverAtom = atom<Driver | null>({
  key: 'updateDriverAtom',
  default: null,
})

export const useUpdateDriverDrawer = () => {
  const [driver, setDriver] = useRecoilState(updateDriverAtom)

  return {
    isOpen: driver !== null,
    driver: driver,
    open: (driver: Driver) => setDriver(driver),
    close: () => setDriver(null),
  }
}

export const UpdateDriverDrawer = () => {
  const { isOpen, close, driver } = useUpdateDriverDrawer()
  const { refetch } = useFilterDrivers()

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      width={500}
      title="Editar Transportista"
    >
      {driver && (
        <UpdateDriver
          driver={driver}
          onClose={close}
          onRefetch={() => refetch()}
        />
      )}
    </Drawer>
  )
}

const UpdateDriver = ({
  driver,
  onClose,
  onRefetch,
}: {
  driver: Driver
  onClose?: () => void
  onRefetch: () => void
}) => {
  const [form] = Form.useForm<Driver>()

  const updateDriverMt = useMutation({
    mutationFn: updateDriver,
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
    onSuccess: () => {
      // refetch()
      onRefetch()
      onClose?.()
    },
  })

  const onFinish = async (values: Driver) => {
    updateDriverMt.mutate(values)
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
    <Form
      onValuesChange={onValuesChange}
      initialValues={{
        ...driver,
      }}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      form={form}
    >
      <Form.Item name={'id'} label={'ID'}>
        <Input readOnly />
      </Form.Item>
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

      <Form.Item name={'transportName'} label="Compañia">
        <Input />
      </Form.Item>

      <Form.Item name={'transportPlateNumber'} label={'Placa'}>
        <Input />
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
          loading={updateDriverMt.isPending}
        >
          Guardar
        </Button>
      </Form.Item>
    </Form>
  )
}
