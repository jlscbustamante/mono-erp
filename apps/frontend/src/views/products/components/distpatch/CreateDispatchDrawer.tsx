import { useMutation } from '@tanstack/react-query'
import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import useMessage from 'antd/es/message/useMessage'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { createDispatchException } from '@/data/hex/inventory'
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchCreateDto,
  DispatchItemCreateDto,
} from '@/data/hex/types'
import {
  DispatchStatus,
  IDispatch,
  IDispatchItem,
  IInvProductItem,
} from '@/data/products/types'
import { fCurrency, filterSelectForm } from '@/utils'

import { useDispatch } from '../../state/useDispatch'
import { ListItemsDispatchDrawer } from './LIistItemsDispatchDrawer'

export const CreateDispatchDrawer = () => {
  const { store } = useDispatch()
  const [items, setItems] = useState<
    (Partial<IInvProductItem> & {
      key: number
      quantity: number
      totalValue: number
    })[]
  >([])
  const [openList, setOpenList] = useState(false)
  const [messageApi, contextHolder] = useMessage()
  const [newDispatch, setNewDispatch] = useState<Partial<IDispatch>>({
    moveAt: dayjs().format('YYYY-MM-DD'),
    status: DispatchStatus.NEW,
  })

  const addNewItem = (item: Partial<IInvProductItem>) => {
    if (Object.keys(item).length === 0) return
    if (items.findIndex((i) => i.itemName === item.itemName) !== -1) {
      messageApi.error('Ya existe este item en el despacho', 1.4)
      return
    }
    setItems([
      ...items,
      {
        key: Date.now(),
        ...item,
        quantity: 1,
        totalValue: item.unitPrice ?? 0,
      },
    ])
  }

  const setNewItems = (items: IDispatchItem[]) => {
    setItems([
      ...items.map((item) => {
        return {
          key: item.id,
          productId: item.productId,
          itemId: item.id,
          itemName: item.itemName,
          brandId: item.brandId,
          presentationId: item.presentationId,
          unitValue: item.unitValue,
          quantity: item.quantity,
          totalValue: item.unitValue * item.quantity,
          _brandName: item.brand?.brand ?? '',
          _measureCode: item?.item?.product?.measure?.code ?? '',
          _presentationName: item?.presentation?.presentation ?? '',
        }
      }),
    ])
  }

  const clear = () => {
    setItems([])
    setNewDispatch({
      moveAt: dayjs().format('YYYY-MM-DD'),
      status: DispatchStatus.NEW,
    })
  }

  const saveDispatchMt = useMutation({
    mutationFn: createDispatchException,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      toast.success('Despacho creado')
      store.setDrawers({ create: false })
      clear()
      store.addControlUpdateOrCreated()
    },
  })

  const onCreate = async () => {
    const dispatch: DispatchCreateDto = {
      gloss: newDispatch.gloss ?? '',
      dispatchAt: newDispatch.moveAt!,
      moveType: DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE,
      netValue: newDispatch.netValue ?? 0,
      numGuide: newDispatch.numGuide ?? '',
      numInvoice: newDispatch.numInvoice ?? '',
      requestBy: '',
      approvedBy: '',
      status: DISPATCH_STATUS.NEW,
      taxValue: newDispatch.taxValue ?? 0,
      totalValue: newDispatch.totalValue ?? 0,
      wareFromId: newDispatch.wareFromId!,
      wareToId: newDispatch.wareToId!,
      items: items
        .filter((el) => el.quantity != 0)
        .map((item) => {
          return {
            dispatchId: 0,
            itemId: item.id!,
            itemName: item.itemName!,
            measureId: item.product!.measure!.id,
            presentationId: item.presentationId!,
            presentationName: item.presentation?.presentation ?? '',
            quantity: item.quantity,
            totalValue: item.totalValue,
            unitValue: item.unitPrice!,
          } satisfies DispatchItemCreateDto
        }),
    }
    saveDispatchMt.mutate(dispatch)
  }

  const isAvailable = useMemo(() => {
    let isAvailable = true
    if (newDispatch.wareFromId && newDispatch.wareToId) {
      if (newDispatch.wareFromId === newDispatch.wareToId) {
        isAvailable = false
      }
    } else {
      if (!newDispatch.wareFromId && !newDispatch.wareToId) {
        isAvailable = false
      }
    }

    return isAvailable
  }, [newDispatch.wareFromId, newDispatch.wareToId, saveDispatchMt.isPending])

  useEffect(() => {
    const netValue = items.reduce((a, b) => a + (b.totalValue ?? 0), 0)
    const totalValue = netValue + (newDispatch.taxValue ?? 0)
    setNewDispatch({
      ...newDispatch,
      netValue: netValue,
      totalValue,
      // taxValue: Number((netValue * 0.18).toFixed(2)),
    })
  }, [items])

  useEffect(() => {
    setNewDispatch({
      ...newDispatch,
      totalValue: (newDispatch.netValue ?? 0) + (newDispatch.taxValue ?? 0),
    })
  }, [newDispatch.taxValue])
  // 16:08
  //
  // 16:30
  return (
    <>
      {contextHolder}
      <Drawer
        open={store.drawers.create}
        title="Crear movimiento de mercaderia excepcional"
        onClose={() => store.setDrawers({ create: false })}
        width={900}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="Desde">
            <div className="flex gap-1">
              <Select
                placeholder="Selecciona una almacén"
                showSearch={true}
                filterOption={filterSelectForm}
                loading={store.loading.warehouses}
                value={newDispatch.wareFromId}
                allowClear={true}
                onChange={(id) =>
                  setNewDispatch({ ...newDispatch, wareFromId: id })
                }
              >
                {store.warehouses
                  // .filter((el) => (el.type as any) === WAREHOUSE_TYPE.WAREHOUSE)
                  .map((w) => (
                    <Select.Option key={w.id} value={w.id}>
                      {w.name}
                    </Select.Option>
                  ))}
              </Select>
              {/* <CreateWareHouseModal sucursales={sucursales} /> */}
            </div>
          </Form.Item>
          <Form.Item label="Hacia">
            <div className="flex gap-1">
              <Select
                placeholder="Selecciona una almacén"
                showSearch={true}
                allowClear={true}
                filterOption={filterSelectForm}
                loading={store.loading.warehouses}
                value={newDispatch.wareToId}
                onChange={(id) =>
                  setNewDispatch({ ...newDispatch, wareToId: id })
                }
              >
                {store.warehouses.map((w) => (
                  <Select.Option key={w.id} value={w.id}>
                    {w.name}
                  </Select.Option>
                ))}
              </Select>
              {/* <CreateWareHouseModal sucursales={sucursales} /> */}
            </div>
          </Form.Item>
          <Form.Item label="N° de Factura">
            <Input
              value={newDispatch.numInvoice ?? ''}
              onChange={(e) => {
                setNewDispatch({ ...newDispatch, numInvoice: e.target.value })
              }}
            />
          </Form.Item>
          <Form.Item label="N° de Guia">
            <Input
              value={newDispatch.numGuide ?? ''}
              onChange={(e) =>
                setNewDispatch({ ...newDispatch, numGuide: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Fecha de Despacho">
            <DatePicker
              allowClear={false}
              value={dayjs(newDispatch.moveAt)}
              onChange={(date) =>
                setNewDispatch({
                  ...newDispatch,
                  moveAt: date?.format('YYYY-MM-DD'),
                })
              }
            />
          </Form.Item>
          <Form.Item label="Descripción">
            <TextArea
              value={newDispatch.gloss}
              onChange={(e) =>
                setNewDispatch({ ...newDispatch, gloss: e.target.value })
              }
              placeholder="Descripción"
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          </Form.Item>
          <div className="flex gap-2">
            <Divider>
              {items.length} Items en la lista.{' '}
              <a href="#" onClick={() => setOpenList(true)}>
                Ver la lista
              </a>
            </Divider>
          </div>
          <div className="my-4 ml-auto w-72 grid grid-cols-2 justify-items-end gap-1">
            <p>Neto :</p>
            <p>{fCurrency(newDispatch.netValue ?? 0)}</p>
            <p>IGV(18%) :</p>
            <InputNumber
              size="small"
              width={'80px'}
              precision={2}
              value={newDispatch.taxValue ?? 0}
              onChange={(value) =>
                setNewDispatch({ ...newDispatch, taxValue: value ?? 0 })
              }
            />
            <p>Valor total : </p>
            <p>{fCurrency(newDispatch.totalValue ?? 0)}</p>
          </div>
          <div className="py-3 text-right">
            <Button
              type="primary"
              onClick={onCreate}
              loading={saveDispatchMt.isPending}
              // loading={isAvailable}
              // disabled={items.length == 0}
              disabled={!isAvailable}
            >
              Guardar Despacho
            </Button>
          </div>
        </Form>
      </Drawer>
      <ListItemsDispatchDrawer
        dispatch={newDispatch}
        items={items}
        open={openList}
        onClose={() => setOpenList(false)}
        addNewItem={addNewItem}
        setItems={setItems}
        setNewItems={setNewItems}
      />
    </>
  )
}
