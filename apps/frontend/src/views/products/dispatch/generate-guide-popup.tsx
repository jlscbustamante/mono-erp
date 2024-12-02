import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Popover, Segmented, Select } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  generateGuideWithTransportista,
  generateInvoiceAndGuide,
} from '@/data/hex/inventory'
import { Dispatch, DispatchTransport } from '@/data/hex/types'

import { filterSelectForm } from '@/utils'
import { useDrivers } from './use-drivers'

type TypeGuide = 'Externo' | 'Interno'
export const GenerateGuidePopup = ({
  dispatch,
  onUpdate,
  onlyguide,
}: {
  dispatch: Dispatch
  onUpdate?: () => void
  onlyguide?: boolean
}) => {
  const [typeGuide, setTypeGuide] = useState<TypeGuide>('Externo')
  const [open, setOpen] = useState(false)

  const generateInvoiceAndGuideMt = useMutation({
    mutationFn: generateInvoiceAndGuide,
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
    onMutate: () => {
      setOpen(false)
    },
    onSuccess: () => {
      onUpdate?.()
    },
  })

  const generateGuideMt = useMutation({
    mutationFn: generateGuideWithTransportista,
    onError: (err) => {
      toast.error(err.message, {
        autoClose: false,
      })
    },
    onMutate: () => {
      setOpen(false)
    },
    onSuccess: () => {
      onUpdate?.()
    },
  })

  const content = (
    <div className="w-80">
      <p className="mb-2 font-semibold">Completa los datos del transporte</p>
      <Segmented
        options={['Externo', 'Interno']}
        block
        value={typeGuide}
        onChange={(val) => setTypeGuide(val as TypeGuide)}
      />
      {typeGuide === 'Externo' ? (
        <GuideWithTransport
          onlyguide={onlyguide}
          generate={(data) => {
            setOpen(false)
            Modal.confirm({
              cancelText: 'Cancelar',
              okText: 'Facturar',
              title: '¿ Esta seguro que desea facturar este despacho ?',
              content:
                'Esta accion genera facura y guia, una vez facturado no podra modificarse.',
              onOk: () => {
                if (onlyguide) {
                  generateGuideMt.mutate({
                    dispatchId: dispatch.id,
                    ...data,
                  })
                } else {
                  generateInvoiceAndGuideMt.mutate({
                    id: dispatch.id,
                    transport: data,
                  })
                }
              },
            })
          }}
        />
      ) : (
        <div className="flex justify-center py-5">
          <p className="text-center text-slate-500">No disponible</p>
          <Button
            type="primary"
            className="hidden"
            size="small"
            onClick={() =>
              Modal.confirm({
                cancelText: 'Cancelar',
                okText: 'Facturar',
                title: '¿ Esta seguro que desea facturar este despacho ?',
                content:
                  'Esta accion genera facura y guia, una vez facturado no podra modificarse.',
                onOk: () =>
                  generateInvoiceAndGuideMt.mutate({
                    id: dispatch.id,
                    transport: null,
                  }),
              })
            }
            loading={
              generateInvoiceAndGuideMt.isPending || generateGuideMt.isPending
            }
          >
            {onlyguide ? 'Generar Guia' : 'Facturar'}
          </Button>
        </div>
      )}
    </div>
  )
  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        size="small"
        loading={
          generateInvoiceAndGuideMt.isPending || generateGuideMt.isPending
        }
      >
        {onlyguide ? 'Generar Guia' : 'Facturar'}
      </Button>
    </Popover>
  )
}

const GuideWithTransport = ({
  generate,
  onlyguide,
}: {
  generate: (data: DispatchTransport) => void
  onlyguide?: boolean
}) => {
  const [form] = Form.useForm<DispatchTransport>()
  const [selectd, setSelected] = useState<undefined | number>(undefined)
  const query = useDrivers()

  const handleSubmit = (data: DispatchTransport) => {
    generate(data)
  }

  const handleSelect = (id: number) => {
    const driver = query.data?.find((d) => d.id === id)
    if (!driver) return

    form.setFieldsValue({
      driverDocumentType: driver.driverTypeDoc,
      driverFirstName: driver.driverFirstName,
      driverLastName: driver.driverLastName,
      driverDocumentNumber: driver.driverDocNumber,
      driverLicenseNumber: driver.driverLicenseNumber,
      licensePlateNumber: driver.transportPlateNumber,
      transportCompanyName: driver.transportCompanyName,
    })
  }

  return (
    <div>
      <div>
        <Select
          value={selectd}
          className="block w-9/12 my-2 ml-auto"
          size="small"
          filterOption={filterSelectForm}
          showSearch
          placeholder="Selecciona al transportista"
          onChange={(val) => {
            setSelected(val)
            handleSelect(val)
          }}
        >
          {query.data?.map((driver) => (
            <Select.Option value={driver.id} key={driver.id}>
              {`${driver.driverFirstName} ${driver.driverLastName}`}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Form
        className="my-3"
        onFinish={handleSubmit}
        initialValues={
          {
            driverDocumentType: 'DNI',
            driverDocumentNumber: '',
            driverFirstName: '',
            driverLastName: '',
            driverLicenseNumber: '',
            licensePlateNumber: '',
            transportCompanyName: '',
          } as DispatchTransport
        }
        form={form}
        name="guideTr"
        autoComplete="off"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        size="small"
      >
        <Form.Item name={'transportCompanyName'} label="Compañia">
          <Input />
        </Form.Item>
        <Form.Item name={'licensePlateNumber'} label="N° Placa">
          <Input />
        </Form.Item>

        <Form.Item name={'driverFirstName'} label="Nombres">
          <Input />
        </Form.Item>
        <Form.Item name={'driverLastName'} label="Apellidos">
          <Input />
        </Form.Item>
        <Form.Item name={'driverDocumentType'} label="Doc.">
          <Select>
            <Select.Option value="DNI">DNI</Select.Option>
            <Select.Option value="RUC">RUC</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={'driverDocumentNumber'} label="N° Doc.">
          <Input />
        </Form.Item>
        <Form.Item name={'driverLicenseNumber'} label="N° Licencia">
          <Input />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end">
            <Button size="small" type="primary" htmlType="submit">
              {onlyguide ? 'Generar Guia' : 'Facturar'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
