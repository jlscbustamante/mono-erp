/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { getWarehouses } from '@/data/hex/inventory'
import {
  getItemsActive,
  getPurchase,
  updatePurchase,
} from '@/data/hex/purchase'
import {
  type Item,
  PurchaseItemUpdate,
  PurchaseUpdaetDto,
  WAREHOUSE_TYPE,
} from '@/data/hex/types'
import { cn, filterSelectForm } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

const editPurchaseAtom = atom<{
  open: boolean
  id: number | null
}>({
  key: 'editPurchaseAtom',
  default: {
    open: false,
    id: null,
  },
})

export const useEditPurchaseDrawer = () => {
  const [value, setValue] = useRecoilState(editPurchaseAtom)

  const close = () => {
    setValue({
      open: false,
      id: null,
    })
  }

  const open = (id: number) => {
    setValue({
      open: true,
      id,
    })
  }

  return {
    id: value.id,
    isOpen: value.open,
    close: close,
    open: open,
  }
}

export const EditPurchaseDrawer = ({ onUpdate }: { onUpdate?: () => void }) => {
  const { close, isOpen, id } = useEditPurchaseDrawer()
  const [purchase, setPurchase] = useState<null | PurchaseUpdaetDto>(null)

  const getPurchaseMt = useMutation({
    mutationFn: getPurchase,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (data) => {
      if (!data) setPurchase(null)
      else
        setPurchase({
          ...data,
          items: data.items.map((el) => ({ ...el, key: el.id })),
        })
    },
  })

  const handleSaveMt = useMutation({
    mutationFn: updatePurchase,

    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      close()
      toast.info('Movimiento actualizado')
      onUpdate?.()
    },
  })

  useEffect(() => {
    if (!id) return
    getPurchaseMt.mutate(id)
  }, [id, isOpen])

  return (
    <Drawer open={isOpen} onClose={close} width={800} title="Editar compra">
      {purchase && (
        <PurchaseBody
          purchase={purchase}
          setPurchase={setPurchase}
          onSave={(purchase: PurchaseUpdaetDto) => {
            handleSaveMt.mutate(purchase)
          }}
          isLoading={handleSaveMt.isPending}
        />
      )}
    </Drawer>
  )
}

const PurchaseBody = ({
  purchase,
  setPurchase,
  onSave,
  isLoading,
}: {
  purchase: PurchaseUpdaetDto
  setPurchase: (purchase: PurchaseUpdaetDto) => void
  onSave: (purchase: PurchaseUpdaetDto) => void
  isLoading: boolean
}) => {
  const netValue = useMemo(() => {
    const totalValue = purchase.items.reduce(
      (acc, el) => acc + el.totalValue,
      0,
    )
    return totalValue
  }, [purchase])
  const totalValue = useMemo(() => {
    const netValue = purchase.items.reduce((acc, el) => acc + el.totalValue, 0)
    const taxValue = purchase.taxValue ?? 0
    const discount = purchase.discount ?? 0
    return netValue - discount + taxValue
  }, [purchase])

  const isAvailable = useMemo(() => {
    if (purchase.items.some((el) => !el.itemId)) return false
    if (totalValue < 0) return false
    return true
  }, [purchase, totalValue])

  const queryWarehouses = useQuery({
    queryKey: ['warehouses-purchase'],
    queryFn: async () => {
      const ws = await getWarehouses()
      return ws.filter((el) => el.type == WAREHOUSE_TYPE.WAREHOUSE)
    },
  })
  const allItems = useQuery({
    queryKey: ['items-purchase'],
    queryFn: getItemsActive,
  })

  useEffect(() => {
    //
    const netValue = purchase.items.reduce((acc, el) => acc + el.totalValue, 0)
    const middleValue = netValue - (purchase.discount ?? 0)
    const taxValue = purchase.taxValue != null ? middleValue * 0.18 : null
    setPurchase({
      ...purchase,
      taxValue,
    })
  }, [purchase.items, purchase.discount])

  return (
    <div>
      <div>
        <Form
          size="small"
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          onSubmitCapture={(e) => e.preventDefault()}
        >
          <Form.Item label="Id">
            <Input readOnly value={purchase.id} />
          </Form.Item>
          <Form.Item label="Número de factura">
            <Input
              value={purchase.numInvoice}
              onChange={(e) =>
                setPurchase({ ...purchase, numInvoice: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Número de guia">
            <Input
              value={purchase.numGuide}
              onChange={(e) =>
                setPurchase({ ...purchase, numGuide: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Fecha de compra">
            <DatePicker
              allowClear={false}
              value={dayjs(purchase.purchaseAt)}
              onChange={(e: any) => {
                setPurchase({ ...purchase, purchaseAt: e.format('YYYY-MM-DD') })
              }}
            />
          </Form.Item>
          <Form.Item label="Glosa">
            <Input
              value={purchase.gloss}
              onChange={(e) =>
                setPurchase({ ...purchase, gloss: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Almacen">
            <Select
              value={purchase.warehouseId}
              onChange={(code) => {
                setPurchase({ ...purchase, warehouseId: code })
              }}
            >
              {queryWarehouses.data?.map((el) => (
                <Select.Option key={el.code} value={el.code}>
                  {el.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <EditItems
          purchaseId={purchase.id}
          allItems={allItems.data ?? []}
          items={purchase.items}
          onChange={(newItems) => {
            setPurchase({ ...purchase, items: newItems })
          }}
        />
        <div>
          <ul className="list-none w-[400px] ml-auto space-y-1 my-2">
            <ListItem title="Subtotal" value={fNumber(netValue)} />
            <ListItem
              title="Descuento"
              value={
                <InputNumber
                  size="small"
                  className="w-[100px]"
                  precision={2}
                  min={0}
                  value={purchase.discount}
                  onChange={(e) =>
                    setPurchase({
                      ...purchase,
                      discount: Number(e ?? 0),
                    })
                  }
                />
              }
            />
            <ListItem
              title="IGV(18%)"
              titleAddon={
                <Checkbox
                  checked={purchase.taxValue !== null}
                  onChange={(val) => {
                    const check = val.target.checked
                    let value = 0
                    if (check) {
                      value = netValue * 0.18
                    }

                    setPurchase({
                      ...purchase,
                      taxValue: check ? (purchase.taxValue ?? value) : null,
                    })
                  }}
                />
              }
              value={
                <InputNumber
                  disabled={purchase.taxValue == null}
                  size="small"
                  className="w-[100px]"
                  precision={2}
                  min={0}
                  value={purchase.taxValue}
                  onChange={(e) =>
                    setPurchase({
                      ...purchase,
                      taxValue: Number(e ?? 0),
                    })
                  }
                />
              }
            />
            <ListItem
              title="Total"
              value={
                <span className="font-semibold">{fNumber(totalValue)}</span>
              }
            />
          </ul>
        </div>
      </div>
      <div className="mb-4 mt-6 flex justify-end">
        <Button
          type="primary"
          onClick={() => onSave(purchase)}
          loading={isLoading}
          disabled={!isAvailable}
        >
          Guardar
        </Button>
      </div>
    </div>
  )
}
const ListItem = ({
  title,
  value,
  titleAddon,
}: {
  title: string
  titleAddon?: React.ReactNode
  value?: React.ReactNode | string
}) => {
  return (
    <li className="flex gap-1">
      <span className="flex w-2/3 gap-2 items-center justify-end">
        {title}
        {titleAddon}
      </span>
      <span className="block w-1/3 text-right">{value}</span>
    </li>
  )
}

const EditItems = ({
  items,
  allItems,
  purchaseId,
  onChange,
}: {
  purchaseId: number
  items: PurchaseItemUpdate[]
  allItems: Item[]
  onChange: (items: PurchaseItemUpdate[]) => void
}) => {
  const handleChangeItem = (key: number, itemId: number) => {
    const item = allItems.find((el) => el.id === itemId)
    if (item) {
      const modifiedItems = items.map((el) => {
        if (el.key === key) {
          return {
            key: el.key,
            id: el.id,
            itemId: item.id,
            itemName: item.name,
            presentationId: item.presentationId,
            presentationName: item.presentationName,
            purchaseId: el.purchaseId,
            quantity: 0,
            totalValue: 0,
            unitValue: 0,
          } satisfies PurchaseItemUpdate
        }
        return el
      })
      onChange(modifiedItems)
    }
  }
  const handleChangePrice = (key: number, price: number) => {
    const modifiedItems = items.map((el) => {
      if (el.key === key) {
        return {
          ...el,
          unitValue: price,
          totalValue: Number((el.quantity * price).toFixed(2)),
        } satisfies PurchaseItemUpdate
      }
      return el
    })
    onChange(modifiedItems)
  }

  const handleChangeQuantity = (key: number, quantity: number) => {
    const modifiedItems = items.map((el) => {
      if (el.key === key) {
        return {
          ...el,
          quantity,
          totalValue: el.unitValue * quantity,
        } satisfies PurchaseItemUpdate
      }
      return el
    })
    onChange(modifiedItems)
  }

  const deleteRow = (key: number) => {
    const modifiedItems = items.filter((el) => el.key !== key)
    onChange(modifiedItems)
  }

  const columns: ColumnsType<PurchaseItemUpdate> = [
    {
      title: 'Item',
      width: '100%',
      render: (_, record) => {
        return (
          <Select
            className="w-[450px]"
            size="small"
            value={record.itemId}
            showSearch={true}
            filterOption={filterSelectForm}
            onChange={(itemId: number) => {
              handleChangeItem(record.key, itemId)
            }}
          >
            {allItems?.map((el) => (
              <Select.Option
                key={el.id}
                value={el.id}
                // classNam="bg-red-400 hover:!bg-red-800"
                className={cn({
                  '!bg-amber-100 hover:!bg-amber-200': el.name
                    .toLowerCase()
                    .includes('pizza m'),
                })}
              >
                {el.name}
              </Select.Option>
            ))}
          </Select>
        )
      },
    },
    {
      title: 'P.U.',
      dataIndex: 'unitValue',
      width: 100,
      render: (val: number, record: PurchaseItemUpdate) => {
        return (
          <InputNumber
            precision={2}
            value={val}
            min={0}
            onChange={(quantity) => {
              handleChangePrice(record.key, quantity ?? 0)
            }}
            size="small"
            className="min-w-[80px] block"
          />
        )
      },
    },
    {
      title: 'Q',
      dataIndex: 'quantity',
      render: (val: number, record: PurchaseItemUpdate) => {
        return (
          <InputNumber
            min={0}
            precision={3}
            size="small"
            value={val}
            onChange={(quantity) => {
              handleChangeQuantity(record.key, quantity ?? 0)
            }}
            className="w-full min-w-[80px] block"
          />
        )
      },
    },
    {
      title: 'Total',
      dataIndex: 'totalValue',
      render: (val: number) => fNumber(val, 2),
    },
    {
      title: '',
      render: (_, record: PurchaseItemUpdate) => {
        return (
          <div>
            <MdDelete
              className="w-5 h-auto cursor-pointer"
              onClick={() => deleteRow(record.key)}
            />
          </div>
        )
      },
    },
  ]

  const handleAddItem = () => {
    const newItem: PurchaseItemUpdate = {
      id: undefined,
      itemId: undefined,
      itemName: '',
      key: Date.now(),
      presentationId: -1,
      presentationName: '',
      purchaseId: purchaseId,
      quantity: 0,
      totalValue: 0,
      unitValue: 0,
    }
    onChange([...items, newItem])
  }
  return (
    <>
      <p
        className="my-2 text-slate-800 hover:underline cursor-pointer"
        onClick={handleAddItem}
      >
        + Agregar item
      </p>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={items}
        rowKey={(item) => item.key}
      />
    </>
  )
}
