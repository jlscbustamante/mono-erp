import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Popover, Segmented, Select } from 'antd'
import { useState } from 'react'
import { toast } from 'react-toastify'

import { Dispatch, DispatchTransport } from '@/data/hex/types'

import { viewClient } from '@/lib/rpc'
import { filterSelectForm } from '@/utils'
import { TransportInfoDto } from '@types'
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
    // mutationFn: generateInvoiceAndGuide,
    mutationFn: async (data: {
      id: number
      transport: DispatchTransport | null
    }) => {
      if (!data.transport || !data.transport.driverDocumentNumber) {
        throw new Error('No se puede generar guia sin datos de transporte')
      }
      const req =
        await viewClient.api.view.inventory.invoice.generate_invoice_and_guide.$post(
          {
            json: {
              dispatch_id: data.id,
              transport: {
                driver_document_number: data.transport.driverDocumentNumber,
                driver_document_type: data.transport.driverDocumentType,
                driver_first_name: data.transport.driverFirstName,
                driver_last_name: data.transport.driverLastName,
                driver_license_number: data.transport.driverLicenseNumber,
                lincense_plate_number: data.transport.licensePlateNumber,
                transport_company_name: data.transport.transportCompanyName,
              } satisfies Partial<TransportInfoDto>,
            },
          },
        )
      if (!req.ok) {
        const error = await req.json()
        throw new Error(error.message)
      }
    },
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

  // Este tipo es definido para evitar reemplzar todo
  type DataGuideWithTransport = { dispatchId: number } & DispatchTransport
  const generateGuideMt = useMutation({
    // mutationFn: generateGuideWithTransportista,
    mutationFn: async (data: DataGuideWithTransport) => {
      const req =
        await viewClient.api.view.inventory.invoice.generate_guide.$post({
          json: {
            dispatch_id: data.dispatchId,
            transport: {
              driver_document_number: data.driverDocumentNumber,
              driver_document_type: data.driverDocumentType,
              driver_first_name: data.driverFirstName,
              driver_last_name: data.driverLastName,
              driver_license_number: data.driverLicenseNumber,
              lincense_plate_number: data.licensePlateNumber,
              transport_company_name: data.transportCompanyName,
            } satisfies TransportInfoDto,
          },
        })

      if (!req.ok) {
        const error = await req.json()
        throw new Error(error.message)
      }
    },
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
        type="primary"
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
