import { PrinterOutlined } from '@ant-design/icons'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Popover,
  Radio,
  Select,
  Spin,
  Table,
  Tag,
} from 'antd'
import Search from 'antd/es/input/Search'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BsPrinter } from 'react-icons/bs'
import { TbTruckDelivery } from 'react-icons/tb'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { DispatchStatus, IDispatch, IDispatchItem } from '@/data/products/types'
import * as sdkRequest from '@/data/requests/sdk'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { useDispatch } from '../../state/useDispatch'
import style from '../purchase/infoPurchase.module.css'
import { UpdateDispatchDrawer } from './UpdateDispatchDrawer'

interface ITransportista {
  transporte_nro_doc: string
  transporte_tipo_doc: string
  transporte_razon_social: string
  transporte_nro_placa: string
  conductor_tipo: string
  conductor_tipo_doc: string
  conductor_nro_doc: string
  conductor_nombres: string
  conductor_apellidos: string
  conductor_nro_licencia: string
}

const defaultTransportistaDatos: Partial<ITransportista> = {
  transporte_tipo_doc: '6',
  conductor_tipo_doc: 'DNI',
}

// const verifyUrlDoc = async (url: string): Promise<boolean> => {
//   try {
//     console.log(url)
//     const response = await sdk.pdfIsAvailable(url)
//     console.log(response)
//     return response.isAvailable
//   } catch (err: any) {
//     return false
//   }
// }

export const InfoDispatchDrawer = () => {
  const { store, getOneDispatch } = useDispatch()
  const [dispatch, setDispatch] = useState<IDispatch | undefined>(undefined)
  const [openList, setOpenList] = useState(false)
  const componentRef = useRef(null)
  const [reload, setReload] = useState(0)
  const [transportista, setTransportista] = useState<'I' | 'E'>('E')
  const [transportistaDatos, setTransporitaDatos] = useState<
    Partial<ITransportista>
  >(defaultTransportistaDatos)
  const [savingApprove, setSavingApprove] = useState(false)
  const [, setPopoverTransportista] = useState(false)
  const [loadingPrintGuide] = useState(false)
  const [searchingRuc, setSearchingRuc] = useState(false)
  const refList = useRef(null)

  const availableSaveTransportista = useMemo(() => {
    if (transportista == 'E') {
      if (transportistaDatos?.transporte_nro_placa?.length != 6) return false
      if (transportistaDatos?.conductor_nro_licencia?.length != 9) return false
      if (
        !transportistaDatos.conductor_nombres ||
        !transportistaDatos.conductor_apellidos ||
        !transportistaDatos.conductor_nro_doc ||
        !transportistaDatos.conductor_nro_licencia
      )
        return false
      if (!transportistaDatos.transporte_razon_social) return false
    }
    // return dispatch?.status == DispatchStatus.NEW
    return true
  }, [dispatch, transportista, transportistaDatos])

  const getStatusTag = (status: DispatchStatus) => {
    if (status == DispatchStatus.NEW)
      return <Tag color="blue">Pedido nuevo</Tag>
    else if (status == DispatchStatus.APPROVED)
      return <Tag color="gold">Pedido por despachar</Tag>
    else if (status == DispatchStatus.DISPATCHED)
      return <Tag color="green">Pedido despachado</Tag>
    return <Tag color="red">Pedido anulado</Tag>
  }

  const handleSearchRuc = async (ruc: string) => {
    try {
      setSearchingRuc(true)
      const { name } = await sdkRequest.getNameByRuc(ruc)
      setTransporitaDatos({
        ...transportistaDatos,
        transporte_razon_social: name,
      })
    } catch (err: any) {
      toast.error('Error al buscar ruc, ' + err.message, NOTIFICATION.error)
    } finally {
      setSearchingRuc(false)
    }
  }

  const saveDispatchApprove = async () => {
    if (!dispatch) return
    try {
      setSavingApprove(true)
      if (transportista == 'I') {
        await sdk.approveDispatch(dispatch.id)
      } else if (transportista == 'E') {
        await sdk.saveApproveAndTransportista(dispatch.id, transportistaDatos)
      }
      setReload(reload + 1)
      store.addControlUpdateOrCreated()
      setPopoverTransportista(false)
      setTransporitaDatos(defaultTransportistaDatos)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setSavingApprove(false)
    }
  }

  const dispatchRequest = async () => {
    if (!dispatch) return
    try {
      await sdk.dispatchApproveState(dispatch.id)
      setReload(reload + 1)
      store.addControlUpdateOrCreated()
      store.setDrawers({ edit: false })
      toast.success('Despacho realizado', NOTIFICATION.success)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  useEffect(() => {
    ;(async () => {
      if (store.dispatchIdInfo) {
        const dispatcheResponse = await getOneDispatch(store.dispatchIdInfo)
        console.log(dispatcheResponse)
        setDispatch(dispatcheResponse)
      }
    })()
  }, [store.dispatchIdInfo, reload])

  return (
    <>
      <Drawer
        open={store.drawers.info && !store.drawers.edit}
        width={800}
        onClose={() => {
          store.closeInfoDrawer()
          setDispatch(undefined)
          setPopoverTransportista(false)
        }}
        title={
          <div className="flex justify-between">
            <p>Información de despacho</p>
            {/* <ReactToPrint
              onBeforeGetContent={async () => {
                setModePrint(true)
              }}
              onAfterPrint={() => {
                setModePrint(false)
              }}
              trigger={() => <Button>Imprimir</Button>}
              content={() => componentRef.current}
            /> */}
          </div>
        }
      >
        <DespacharDrawer
          transportista={transportista}
          setTransportista={setTransportista}
          saveDispatchApprove={saveDispatchApprove}
          savingApprove={savingApprove}
          transportistaDatos={transportistaDatos}
          setTransporitaDatos={setTransporitaDatos}
          handleSearchRuc={handleSearchRuc}
          availableSaveTransportista={availableSaveTransportista}
          searchingRuc={searchingRuc}
        />
        {dispatch == undefined ? (
          <div className="flex justify-center h-full items-center flex-col gap-2">
            <Spin />
            <p>Cargando información...</p>
          </div>
        ) : (
          <div ref={componentRef} className={style.toPrint}>
            <div className={style.container}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className={`text-lg ${style.idTitle}`}>
                    Id del despacho: {dispatch.id}
                  </p>
                  {getStatusTag(dispatch.status)}
                </div>
                <div className="flex gap-2 items-center">
                  <ReactToPrint
                    trigger={() => (
                      <Button
                        icon={<PrinterOutlined />}
                        title="Imprimir lista"
                        size="small"
                        type="primary"
                      >
                        Imprimir lista
                      </Button>
                    )}
                    content={() => refList.current}
                  />
                  <Button
                    disabled={
                      dispatch.status != DispatchStatus.NEW &&
                      dispatch.status != DispatchStatus.APPROVED
                    }
                    onClick={() => store.setDrawers({ edit: true })}
                    // icon={<MdEdit />}
                    icon={<TbTruckDelivery />}
                    title="Editar"
                    type="primary"
                    size="small"
                  >
                    Despachar
                  </Button>
                  {/* 
                  <Button
                    loading={savingApprove}
                    // NOTE: preguntar como cambia el estado de nuevo a aprobado
                    // mientras tanto el boton estara disponible para poder cambiar de nuevo -> despachado
                    // disabled={dispatch.status != DispatchStatus.APPROVED}
                    icon={<TbTruckDelivery />}
                    onClick={dispatchRequest}
                    disabled={
                      [
                        DispatchStatus.DISPATCHED,
                        DispatchStatus.CANCELED,
                        DispatchStatus.NEW,
                      ].includes(
                        dispatch.status.toString() as DispatchStatus,
                      ) ||
                      !dispatch.wareFromId ||
                      !dispatch.wareToId
                    }
                    title="Despachar"
                    size="small"
                  >
                    Despachar
                  </Button> */}
                  <Button
                    className="hidden"
                    disabled={dispatch.status != DispatchStatus.APPROVED}
                    icon={<BsPrinter />}
                    title={
                      dispatch.status == DispatchStatus.APPROVED
                        ? 'Imprimir'
                        : 'No se puede imprimir sin estar aprobado'
                    }
                    // onClick={generateOrPrintGuide}
                    onClick={dispatchRequest}
                    loading={loadingPrintGuide}
                    shape="circle"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 my-4">
                <div className={`flex flex-col gap-1 ${style.desc}`}>
                  <div className="grid grid-cols-2">
                    <p>Fecha de despacho: </p>
                    <p>{dispatch.moveAt.split(' ')[0]}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Origen: </p>
                    <p>{dispatch.wareFrom?.name}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Destino: </p>
                    <p>{dispatch.wareTo?.name}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Número de guia:</p>
                    <p>{dispatch.numGuide}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Número de factura:</p>
                    <p>{dispatch.numInvoice}</p>
                  </div>
                  {/* <div className="grid grid-cols-2">
                  <p>Estado :</p>
                  <p>{getStatusTag(dispatch.status)}</p>
                </div> */}
                  <div className="grid grid-cols-2">
                    <p>Registrado por :</p>
                    <p>{dispatch.createdBy}</p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p>Descripción:</p>
                    <Popover
                      content={<div className="w-72">{dispatch.gloss}</div>}
                      trigger={'hover'}
                    >
                      <p className="truncate">{dispatch.gloss}</p>
                    </Popover>
                  </div>
                </div>
                {/* {dispatch.status == DispatchStatus.APPROVED && (
                  <div className="p-2">
                    {dispatch.transporte_razon_social ? (
                      <div className="border-2 border-dashed border-gray-300 h-full bg-gray-100 p-2">
                        <h5 className="font-bold text-sm text-gray-700 mb-1">
                          Datos del transporte
                        </h5>
                        <p className="">
                          Razón social:{' '}
                          <span className="font-normal">
                            {dispatch.transporte_razon_social}
                          </span>
                        </p>
                        <p className="">
                          Conductor :{' '}
                          <span className="font-normal">
                            {dispatch.conductor_nombres}{' '}
                            {dispatch.conductor_apellidos}
                          </span>
                        </p>
                        <p className="">
                          Licencia :{' '}
                          <span className="font-normal">
                            {dispatch.conductor_nro_licencia}
                          </span>
                        </p>
                        <p className="">
                          N° placa:{' '}
                          <span className="font-normal">
                            {dispatch.transporte_nro_placa}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center ">
                        <p>Transporte interno</p>
                      </div>
                    )}
                  </div>
                )} */}
              </div>
              <Table
                pagination={false}
                size="small"
                rowKey={'id'}
                columns={[
                  {
                    title: 'Item de inventario',
                    dataIndex: 'itemName',
                  },
                  {
                    title: '',
                    width: 80,
                    render: (record) => {
                      if (record.id == 'total-items-tb') {
                        return (
                          <a
                            onClick={() => {
                              setOpenList(true)
                            }}
                          >
                            Ver lista
                          </a>
                        )
                      }
                      return null
                    },
                  },
                  {
                    title: 'Valor',
                    dataIndex: 'totalValue',
                    align: 'right',
                    render: (text, record) => {
                      if (record.isSpace) return
                      return <p>{fCurrency(text)}</p>
                    },
                    onCell: () => {
                      return {
                        align: 'right',
                        width: '120px',
                      }
                    },
                  },
                ]}
                onRow={(option: any) => {
                  if (option.isSpace)
                    return {
                      height: 80,
                      style: {},
                    }
                  return {}
                }}
                dataSource={(
                  [
                    {
                      id: 'total-items-tb',
                      itemName: `${dispatch.items?.length} Item(s)`,
                      totalValue: dispatch.netValue,
                    },
                  ] as any
                ).concat([
                  { isSpace: true, id: 'space-tb' },
                  {
                    itemName: 'IGV',
                    id: 'tax-tb',
                    totalValue: dispatch.taxValue,
                  },
                ])}
                footer={() => (
                  <div className="flex justify-end font-bold">
                    <p>
                      Valor total del despacho: {fCurrency(dispatch.totalValue)}
                    </p>
                  </div>
                )}
              />
            </div>
          </div>
        )}
        <ItemList items={dispatch?.items ?? []} refList={refList} />
      </Drawer>
      <InfoDispatcherItemListDrawer
        open={openList}
        setOpen={setOpenList}
        items={dispatch?.items}
      />
      <UpdateDispatchDrawer
        savingApprove={savingApprove}
        onClickFactura={dispatchRequest}
        onUpdate={() => {
          setReload(reload + 1)
          store.addControlUpdateOrCreated()
        }}
      />
    </>
  )
}

const InfoDispatcherItemListDrawer: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
  items?: IDispatchItem[]
}> = ({ open, setOpen, items = [] }) => {
  return (
    <Drawer
      closable={true}
      placement="right"
      open={open}
      onClose={() => setOpen(false)}
      width={750}
    >
      <div>
        <Table
          pagination={false}
          size="small"
          rowKey={'id'}
          dataSource={items}
          columns={[
            {
              title: 'Item de inventario',
              dataIndex: 'itemName',
            },
            {
              title: 'Precio',
              dataIndex: 'unitValue',
            },
            {
              title: 'Cantidad',
              dataIndex: 'quantity',
              render: (value) => fNumber(value, 3),
            },
            {
              title: 'Total',
              dataIndex: 'totalValue',
              render: (value) => fNumber(value),
            },
          ]}
        />
      </div>
    </Drawer>
  )
}

const ItemList = ({
  items = [],
  refList,
}: {
  items: IDispatchItem[]
  refList: any
}) => {
  return (
    <div ref={refList} className="p-10 hidden print:block">
      <Table
        pagination={false}
        size="small"
        rowKey={'id'}
        dataSource={items.sort((a, b) => a.itemName.localeCompare(b.itemName))}
        columns={[
          {
            title: 'Item de inventario',
            dataIndex: 'itemName',
          },
          {
            title: 'Cantidad',
            dataIndex: 'quantity',
            align: 'right',
          },
        ]}
      />
    </div>
  )
}

export const DespacharDrawer = ({
  transportista,
  setTransportista,
  saveDispatchApprove,
  savingApprove,
  transportistaDatos,
  setTransporitaDatos,
  handleSearchRuc,
  availableSaveTransportista,
  searchingRuc,
}: {
  transportista: any
  setTransportista: any
  saveDispatchApprove: any
  savingApprove: any
  transportistaDatos: any
  setTransporitaDatos: any
  handleSearchRuc: any
  searchingRuc: any
  availableSaveTransportista: any
}) => {
  return (
    <Drawer open={false} width={500}>
      <div className="w-96">
        <div className="flex items-center gap-2">
          <p>Transporte : </p>
          <Radio.Group
            value={transportista}
            onChange={(e) => setTransportista(e.target.value)}
          >
            <Radio value={'E'}>Externo</Radio>
            <Radio value={'I'} disabled>
              Interno
            </Radio>
          </Radio.Group>
        </div>
        <div className="mt-4">
          {transportista == 'I' ? (
            <div className="flex justify-end">
              <Button type="primary" onClick={saveDispatchApprove}>
                {savingApprove ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Form wrapperCol={{ span: 19 }} labelCol={{ span: 5 }}>
                <Divider orientation="left">Transporte</Divider>
                <Form.Item label="RUC" labelCol={{ span: 8 }}>
                  {/* <Input
                                    placeholder="..."
                                    value={
                                      transportistaDatos.transporte_nro_doc??
                                      ''
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value
                                      setTransporitaDatos({
                                        ...transportistaDatos,
                                        transporte_razon_social: value,
                                      })
                                    }}
                                  /> */}
                  <Search
                    value={transportistaDatos.transporte_nro_doc ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setTransporitaDatos({
                        ...transportistaDatos,
                        transporte_nro_doc: value,
                      })
                    }}
                    loading={searchingRuc}
                    onSearch={(ruc) => {
                      handleSearchRuc(ruc)
                    }}
                  />
                </Form.Item>
                <Form.Item label="Razón social" labelCol={{ span: 8 }}>
                  <Input
                    placeholder="..."
                    value={transportistaDatos.transporte_razon_social ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setTransporitaDatos({
                        ...transportistaDatos,
                        transporte_razon_social: value,
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item label="Nro. placa" labelCol={{ span: 8 }}>
                  <Input
                    placeholder="Nro. placa sin guiones"
                    value={transportistaDatos.transporte_nro_placa ?? ''}
                    maxLength={6}
                    onChange={(e) => {
                      const re = /^[0-9A-Za-z]+$/
                      const value = e.target.value
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setTransporitaDatos({
                          ...transportistaDatos,
                          transporte_nro_placa: value.toUpperCase(),
                        })
                      }
                    }}
                  />
                </Form.Item>

                <Divider orientation="left">Conductor</Divider>

                <Form.Item label="Tipo de doc." labelCol={{ span: 8 }}>
                  <Select
                    defaultValue="DNI"
                    value={transportistaDatos.conductor_tipo_doc ?? ''}
                  >
                    <Select.Option value="DNI">DNI</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Nro. doc." labelCol={{ span: 8 }}>
                  <Input
                    placeholder="..."
                    value={transportistaDatos.conductor_nro_doc ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setTransporitaDatos({
                        ...transportistaDatos,
                        conductor_nro_doc: value,
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item label="Nombre" labelCol={{ span: 8 }}>
                  <Input
                    placeholder="..."
                    value={transportistaDatos.conductor_nombres ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setTransporitaDatos({
                        ...transportistaDatos,
                        conductor_nombres: value,
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item label="Apellidos" labelCol={{ span: 8 }}>
                  <Input
                    placeholder="..."
                    value={transportistaDatos.conductor_apellidos ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setTransporitaDatos({
                        ...transportistaDatos,
                        conductor_apellidos: value,
                      })
                    }}
                  />
                </Form.Item>
                <Form.Item label="Nro. licencia" labelCol={{ span: 8 }}>
                  <Input
                    maxLength={9}
                    placeholder="9 digitos sin guiones"
                    value={transportistaDatos.conductor_nro_licencia ?? ''}
                    onChange={(e) => {
                      const re = /^[0-9A-Za-z]+$/
                      const value = e.target.value
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setTransporitaDatos({
                          ...transportistaDatos,
                          conductor_nro_licencia: value.toUpperCase(),
                        })
                      }
                    }}
                  />
                </Form.Item>
              </Form>
              <div className="flex justify-end">
                {/* <Button>Guardar</Button> */}
                {/* <Button>Guardar y facturar</Button> */}
                <Button
                  type="primary"
                  loading={savingApprove}
                  onClick={saveDispatchApprove}
                  disabled={!availableSaveTransportista}
                >
                  {savingApprove ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}
