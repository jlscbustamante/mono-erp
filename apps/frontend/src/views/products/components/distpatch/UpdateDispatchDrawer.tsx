import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Table,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { approveDispatch } from '@/data/hex/inventory'
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchItemAddDto,
  DispatchUpdateDto,
} from '@/data/hex/types'
import {
  DispatchStatus,
  IDispatch,
  IDispatchItem,
  IInvProductItem,
} from '@/data/products/types'
import { SucursalType } from '@/data/types'
import {
  delay,
  fCurrency,
  filterOption,
  filterSelectForm,
  safeAny,
} from '@/utils'

import { useDispatch } from '../../state/useDispatch'
import { usePurchase } from '../../state/usePurchase'

export const UpdateDispatchDrawer: React.FC<{
  onUpdate?: () => void
  savingApprove: any
  onClickFactura: any
}> = ({ onUpdate }) => {
  const { store, getOneDispatch, updateDispatch } = useDispatch()
  const [dispatch, setDispatch] = useState<IDispatch | undefined>(undefined)
  const [openList, setOpenList] = useState(false)
  const [loadingSP, setLoadingSP] = useState(false)

  const onSave = async () => {
    if (!dispatch) return
    await updateDispatch(dispatch, () => {
      setDispatch(undefined)
      store.setDrawers({ edit: false })
      onUpdate?.()
    })
  }

  const helperIDispatchToDipatchUpdateDto = (
    dispatch: IDispatch,
  ): DispatchUpdateDto => {
    return {
      id: dispatch.id,
      wareToId: dispatch.wareToId,
      wareFromId: dispatch.wareFromId,
      dispatchAt: dispatch.moveAt.split(' ')[0],
      gloss: dispatch.gloss,
      numInvoice: dispatch.numInvoice ?? '',
      wareFromName: '',
      wareToName: '',
      numGuide: dispatch.numGuide ?? '',
      moveType: DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE,
      netValue: dispatch.netValue,
      totalValue: dispatch.totalValue,
      taxValue: dispatch.taxValue,
      status: DISPATCH_STATUS.APPROVED,
      requestBy: dispatch.createdBy,
      approvedBy: '',
      items:
        dispatch.items?.map((el: any) => {
          return {
            itemId: el.itemId,
            dispatchId: dispatch.id,
            itemName: el.itemName,
            measureId:
              el.item?.product?.measureId ??
              el.item?.product?.measure?.id ??
              el.product?.measureId ??
              el.measureId ??
              1,
            presentationId: el.presentationId,
            presentationName: el.item?.presentation?.presentation,
            quantity: el.quantity,
            totalValue: el.totalValue,
            unitValue: el.unitValue,
          } as DispatchItemAddDto
        }) ?? [],
    }
  }

  const saveAndApprove = async () => {
    setLoadingSP(true)
    try {
      if (!dispatch) return
      await delay(3000)
      const dispatchData = helperIDispatchToDipatchUpdateDto(dispatch)
      await approveDispatch(dispatchData)
      // await updateDispatchAndApprove(dispatch)
      onUpdate?.()

      toast.success('Pedido despachado')
      store.setDrawers({ edit: false })
      setLoadingSP(false)
    } catch (err: any) {
      setLoadingSP(false)
      console.log(err)
      toast.error(err?.message ?? 'Error al registrar el despacho')
    }
  }

  useEffect(() => {
    if (dispatch) {
      const netValue =
        dispatch.items?.reduce((acc, item) => {
          return acc + item.totalValue
        }, 0) ?? 0
      // const taxValue18 = netValue * 0.18
      const totalValue = netValue
      setDispatch({
        ...dispatch,
        netValue: netValue,
        totalValue,
        // taxValue: taxValue18,
      })
    }
  }, [dispatch?.items])

  useEffect(() => {
    ;(async () => {
      if (store.dispatchIdInfo) {
        const dispatcheResponse = await getOneDispatch(store.dispatchIdInfo)
        setDispatch(dispatcheResponse)
      }
    })()
  }, [store.dispatchIdInfo, store.drawers.edit])

  return (
    <>
      <Drawer
        title="Editar Despacho"
        width={800}
        open={store.drawers.edit}
        onClose={() => store.setDrawers({ edit: false })}
      >
        {dispatch == undefined ? (
          <div className="flex justify-center h-full items-center flex-col gap-2">
            <Spin />
            <p>Cargando información...</p>
          </div>
        ) : (
          <div>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
              <Form.Item label="Origen">
                <div className="flex gap-1">
                  <Select
                    placeholder="Selecciona una tienda"
                    showSearch={true}
                    filterOption={filterSelectForm}
                    loading={store.loading.warehouses}
                    value={
                      !dispatch.wareFromId ? undefined : dispatch.wareFromId
                    }
                    onChange={(id) =>
                      setDispatch({ ...dispatch, wareFromId: id })
                    }
                  >
                    {store.warehouses
                      .filter((el) => el.type == SucursalType.Warehouse)
                      .map((w) => (
                        <Select.Option key={w.id} value={w.id}>
                          {w.name}
                        </Select.Option>
                      ))}
                  </Select>
                  {/* <CreateWareHouseModal sucursales={sucursales} /> */}
                </div>
              </Form.Item>
              <Form.Item label="Destino">
                <div className="flex gap-1">
                  <Input value={dispatch!.wareTo!.name} readOnly />
                  {/* <Select
                    placeholder="Selecciona una tienda"
                    showSearch={true}
                    filterOption={filterSelectForm}
                    loading={store.loading.warehouses}
                    value={!dispatch.wareToId ? undefined : dispatch.wareToId}
                    onChange={(id) =>
                      setDispatch({ ...dispatch, wareToId: id })
                    }
                  >
                    {store.warehouses.map((w) => (
                      <Select.Option key={w.id} value={w.id}>
                        {w.name}
                      </Select.Option>
                    ))}
                  </Select> */}
                  {/* <CreateWareHouseModal sucursales={sucursales} /> */}
                </div>
              </Form.Item>
              <Form.Item label="N° de Factura">
                <Input
                  value={dispatch.numInvoice ?? ''}
                  onChange={(e) => {
                    setDispatch({ ...dispatch, numInvoice: e.target.value })
                  }}
                  disabled
                />
              </Form.Item>
              <Form.Item label="N° de Guia">
                <Input
                  disabled={true}
                  value={dispatch.numGuide ?? ''}
                  onChange={(e) =>
                    setDispatch({ ...dispatch, numGuide: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item label="Fecha de Despacho">
                <DatePicker
                  allowClear={false}
                  value={dayjs(dispatch.moveAt)}
                  onChange={(date) =>
                    setDispatch({
                      ...dispatch,
                      moveAt: date!.format('YYYY-MM-DD'),
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Descripción">
                <TextArea
                  value={dispatch.gloss}
                  onChange={(e) =>
                    setDispatch({ ...dispatch, gloss: e.target.value })
                  }
                  placeholder="Descripción"
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>
              <div className="flex gap-2">
                <Divider>
                  {dispatch.items?.filter((el) => el.quantity > 0).length} Items
                  en la lista.{' '}
                  <a href="#" onClick={() => setOpenList(true)}>
                    Editar items
                  </a>
                </Divider>
              </div>
              <div className="my-4 ml-auto w-72 grid grid-cols-2 justify-items-end gap-1">
                <p>Neto :</p>
                <p>{fCurrency(dispatch.netValue ?? 0)}</p>
                <p>IGV(18%) :</p>
                <InputNumber
                  size="small"
                  width={'80px'}
                  precision={2}
                  value={dispatch.taxValue ?? 0}
                  onChange={(value) =>
                    setDispatch({
                      ...dispatch,
                      taxValue: value ?? 0,
                      totalValue: (dispatch.netValue ?? 0) + (value ?? 0),
                    })
                  }
                />
                <p>Valor total : </p>
                <p>{fCurrency(dispatch.totalValue ?? 0)}</p>
              </div>
              <div className="py-3 text-right flex justify-end items-center gap-2">
                <Button
                  onClick={onSave}
                  loading={store.loading.updating}
                  disabled={loadingSP}
                >
                  Guardar
                </Button>
                <Button
                  loading={loadingSP}
                  // NOTE: preguntar como cambia el estado de nuevo a aprobado
                  // mientras tanto el boton estara disponible para poder cambiar de nuevo -> despachado
                  // disabled={dispatch.status != DispatchStatus.APPROVED}
                  // onClick={dispatchRequest}
                  // onClick={saveAndApprove}
                  onClick={() => {
                    const dispatchAt = dispatch.moveAt?.split(' ')[0]
                    Modal.confirm({
                      title: 'Confirmar',
                      content:
                        'La fecha de despacho es ' +
                        dispatchAt +
                        ', ¿desea continuar?',
                      onOk: () => {
                        saveAndApprove()
                      },
                    })
                  }}
                  disabled={
                    [
                      DispatchStatus.DISPATCHED,
                      DispatchStatus.CANCELED,
                    ].includes(dispatch.status.toString() as DispatchStatus) ||
                    !dispatch.wareFromId ||
                    !dispatch.wareToId
                  }
                  title="Despachar"
                  type="primary"
                >
                  Guardar y facturar
                </Button>
                {/* <Button
                  type="primary"
                  onClick={onSave}
                  loading={store.loading.updating}
                  // disabled={items.length == 0}
                >
                  Guardar
                </Button> */}
              </div>
            </Form>
          </div>
        )}
      </Drawer>
      {dispatch && (
        <EditItemList
          open={openList}
          setOpen={setOpenList}
          dispatch={dispatch}
          setDispatch={setDispatch}
        />
      )}
    </>
  )
}

const EditItemList: React.FC<{
  dispatch: IDispatch
  setDispatch: (dispatch: IDispatch) => void
  open: boolean
  setOpen: (open: boolean) => void
}> = ({ dispatch, open, setOpen, setDispatch }) => {
  const { getItemsDispatchInTemplate } = usePurchase()
  const [productItems, setProductItems] = useState<IInvProductItem[]>([])
  const [selectedItem, setSelectedItem] = useState<undefined | number>(
    undefined,
  )

  const addNewItem = () => {
    if (!selectedItem) return
    const item = productItems.find((el) => el.id === selectedItem)
    if (!item) return
    if (dispatch.items?.find((i) => i.itemId === item.id)) return
    const newItem: Partial<IDispatchItem> = {
      id: -1,
      productId: item.productId,
      itemId: item.id,
      itemName: item.itemName,
      measureId: item.measureId,
      brandId: item.brandId,
      presentationId: item.presentationId,
      unitValue: item.unitPrice,
      quantity: 1,
      item: item,
      totalValue: item.unitPrice,
    } as any
    setDispatch({
      ...dispatch,
      items: [...(dispatch.items ?? []), newItem as any],
    })
    setSelectedItem(undefined)
  }

  useEffect(() => {
    ;(async () => {
      const list = await getItemsDispatchInTemplate()
      if (!list) return
      setProductItems(list)
    })()
  }, [])
  return (
    <Drawer open={open} onClose={() => setOpen(false)} width={720}>
      <div className="mb-2 flex gap-1">
        <Select
          size="small"
          value={selectedItem}
          className="w-full"
          placeholder="Selecciona item"
          showSearch
          filterOption={filterOption as safeAny}
          options={productItems.map((el) => ({
            ...el,
            label: el.itemName,
            value: el.id,
          }))}
          onChange={(val) => {
            setSelectedItem(val)
          }}
        />
        <Button size="small" onClick={addNewItem}>
          Agregar item
        </Button>
      </div>
      <Table
        rowKey={'id'}
        size="small"
        pagination={false}
        dataSource={dispatch.items?.filter((el) => el.quantity > 0)}
        // dataSource={dispatch.items}
        columns={[
          {
            title: 'id',
            dataIndex: 'itemId',
          },
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
            render: (text, record) => (
              <InputNumber
                value={text}
                min={0.01}
                precision={3}
                onChange={(value) => {
                  const newItems = dispatch.items ? [...dispatch.items] : []
                  setDispatch({
                    ...dispatch,
                    items: newItems.map((i) => {
                      if (i.itemId == record.itemId) {
                        return {
                          ...i,
                          quantity: value ?? 0.01,
                          totalValue: Number(
                            (i.unitValue * (value ?? 0.01)).toFixed(2),
                          ),
                        }
                      }
                      return i
                    }),
                  })
                  // setDispatch({
                  //   ...dispatch,
                  //   items: [
                  //     ...(dispatch.items?.slice(0, index) ?? []),
                  //     {
                  //       ...record,
                  //       quantity: value,
                  //       totalValue: Number(
                  //         (record.unitValue * value).toFixed(2),
                  //       ),
                  //     },
                  //     ...(dispatch.items?.slice(index + 1) ?? []),
                  //   ],
                  // })
                }}
              />
            ),
          },
          {
            title: 'Total',
            dataIndex: 'totalValue',
          },
          {
            title: '',
            width: 75,
            render: (record: IDispatchItem) => {
              return (
                <a
                  onClick={() => {
                    setDispatch({
                      ...dispatch,
                      items:
                        // dispatch.items?.filter(
                        //   (i) => i.itemId != record.itemId,
                        // ) ?? [],
                        dispatch.items?.map((i) => {
                          if (i.itemId == record.itemId) {
                            return { ...i, quantity: 0, totalValue: 0 }
                          }
                          return i
                        }) ?? [],
                    })
                  }}
                >
                  remover
                </a>
              )
            },
          },
        ]}
      />
    </Drawer>
  )
}
