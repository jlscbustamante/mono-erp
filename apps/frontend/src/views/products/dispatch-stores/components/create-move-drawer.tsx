import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import { approveMovement } from '@/data/hex/inventory'
import {
  DispatchCreate,
  getItemsInventario,
  getSucursalList,
} from '@/data/products/sdk'
import { filterSelectForm } from '@/utils'

const createMoveDrawerAtom = atom({
  key: 'createMoveDrawerAtom',
  default: false,
})

export const useCreateMoveDrawer = () => {
  const [open, setOpen] = useRecoilState(createMoveDrawerAtom)

  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
  }
}

interface ItemList {
  id: number
  itemId: number
  itemName: string
  unitPrice: number
  quantity: number
  totalPrice: number
}

export const CreateMoveDrawer = ({ onCreate }: { onCreate: () => void }) => {
  const { isOpen, close } = useCreateMoveDrawer()
  const [form] = Form.useForm()
  const [items, setItems] = useState<ItemList[]>([])
  const validItems = useMemo(() => {
    return items.filter((el) => el.itemId != -1 && el.quantity > 0)
  }, [items])

  const sucursalesQuery = useQuery({
    queryKey: ['sucursaleSlIST'],
    queryFn: getSucursalList,
  })

  const itemsInventarioQuery = useQuery({
    queryKey: ['itemsInventario'],
    queryFn: getItemsInventario,
  })

  const sucursalesStores = useMemo(() => {
    if (!sucursalesQuery.data) return []
    return sucursalesQuery.data.filter((el) => el.type_sede != 'W')
  }, [sucursalesQuery.data])

  const clearItem = (id: number) => {
    setItems(items.filter((el) => el.id != id))
  }

  const addItem = () => {
    const timestamp = Date.now()
    const newItems: ItemList[] = [
      ...items,
      {
        id: timestamp,
        itemId: -1,
        itemName: '',
        unitPrice: 0,
        quantity: 0,
        totalPrice: 0,
      },
    ]
    setItems(newItems)
  }

  const crearPedidoMt = useMutation({
    mutationFn: approveMovement,
    onSuccess: () => {
      toast.success('Movimiento creado y despachado')
      onCreate()
      close()
      form.resetFields()
      setItems([])
    },
    onError: (err) => {
      toast.error(err?.message ?? 'Error al crear el movimiento')
    },
  })

  const handleSubmit = (values: {
    sucursal_from_id: string
    sucursal_to_id: string
    date: dayjs.Dayjs
    gloss?: string
  }) => {
    if (validItems.length <= 0) {
      toast.warning('No se puede crear un movimiento vacio')
      return
    }
    const data: DispatchCreate = {
      gloss: values.gloss ?? '',
      moveAt: values.date.format('YYYY-MM-DD'),
      storeFromId: values.sucursal_from_id,
      storeId: values.sucursal_to_id,
      items: validItems.map((el) => ({
        itemId: el.itemId,
        quantity: el.quantity,
      })),
    }
    crearPedidoMt.mutate({
      gloss: data.gloss,
      items: data.items,
      moveAt: data.moveAt,
      storeFrom: data.storeFromId,
      storeToId: data.storeId,
    })
  }

  return (
    <Drawer
      className=""
      open={isOpen}
      width={800}
      placement="right"
      title="Nuevo movimiento"
      onClose={close}
    >
      <Form
        labelCol={{ span: 4 }}
        initialValues={{
          date: dayjs(),
        }}
        form={form}
        layout="horizontal"
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Form.Item name={'sucursal_from_id'} label="Origen">
          <Select
            loading={sucursalesQuery.isLoading}
            allowClear={true}
            filterOption={filterSelectForm as any}
            showSearch={true}
          >
            {sucursalesStores.map((el) => (
              <Select.Option key={el.id} value={el.id}>
                {el.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'sucursal_to_id'}
          label="Destino"
          rules={[
            {
              validator: (_, value) => {
                const sucursalFromId = form.getFieldValue('sucursal_from_id')
                if (sucursalFromId && sucursalFromId == value) {
                  return Promise.reject(
                    'Origen y destino no pueden ser iguales',
                  )
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Select
            loading={sucursalesQuery.isLoading}
            allowClear={true}
            filterOption={filterSelectForm as any}
            showSearch={true}
          >
            {sucursalesStores.map((el) => (
              <Select.Option key={el.id} value={el.id}>
                {el.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'date'} label="Fecha" rules={[{ required: true }]}>
          <DatePicker allowClear={false} />
        </Form.Item>
        <Form.Item name={'gloss'} label="Descripción">
          <Input />
        </Form.Item>
        <Form.Item>
          <div>
            <a href="#" onClick={addItem}>
              + Agregar item
            </a>
          </div>
          <Table
            pagination={false}
            size="small"
            rowKey={'id'}
            dataSource={items}
            onRow={(record) => ({
              style: {
                backgroundColor:
                  record.itemId != -1 && record.quantity == 0
                    ? 'rgba(221, 58, 58, 0.1)'
                    : undefined,
              },
            })}
            columns={[
              {
                title: 'Item',
                render: (ctx: ItemList) => {
                  return (
                    <div>
                      <Select
                        allowClear={false}
                        loading={itemsInventarioQuery.isLoading}
                        value={ctx.itemId != -1 ? ctx.itemId : undefined}
                        className="!w-[400px]"
                        filterOption={filterSelectForm as any}
                        showSearch={true}
                        onChange={(val) => {
                          const itemFounded = itemsInventarioQuery.data?.find(
                            (el) => el.id == val,
                          )
                          if (itemFounded) {
                            if (items.some((el) => el.itemId == itemFounded.id))
                              return
                            else {
                              const newItems = items.map((el) => {
                                if (el.id == ctx.id) {
                                  return {
                                    ...el,
                                    itemId: itemFounded.id,
                                    itemName: itemFounded.itemName,
                                    unitPrice: itemFounded.unitPrice,
                                    quantity: 0,
                                    totalPrice: 0,
                                  }
                                }
                                return el
                              })
                              setItems(newItems)
                            }
                          }
                        }}
                      >
                        {itemsInventarioQuery.data?.map((el) => (
                          <Select.Option key={el.id} value={el.id}>
                            {el.itemName}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  )
                },
              },
              {
                title: 'P.U.',
                width: 90,
                render: (ctx: ItemList) => {
                  return <InputNumber value={ctx.unitPrice} precision={2} />
                },
              },
              {
                title: 'Q.',
                width: 100,
                render: (ctx: ItemList) => {
                  return (
                    <InputNumber
                      min={0}
                      // capture and avoid enter
                      onKeyDown={(e) => {
                        if (e.key == 'Enter') e.preventDefault()
                      }}
                      precision={3}
                      className={ctx.quantity == 0 ? 'border-red-700' : ''}
                      onChange={(val) => {
                        if (val) {
                          const newItems = items.map((el) => {
                            if (el.id == ctx.id) {
                              return {
                                ...el,
                                quantity: val,
                                totalPrice: val * ctx.unitPrice,
                              }
                            }
                            return el
                          })
                          setItems(newItems)
                        }
                      }}
                      value={ctx.quantity}
                      disabled={!ctx.itemName}
                    />
                  )
                },
              },

              {
                width: 100,
                title: 'P.T.',
                render: (ctx: ItemList) => {
                  return (
                    <InputNumber
                      readOnly
                      value={ctx.totalPrice}
                      precision={2}
                      prefix={'S/ '}
                    />
                  )
                },
              },
              {
                title: '',
                render: (ctx: ItemList) => {
                  return (
                    <MdDelete
                      onClick={() => clearItem(ctx.id)}
                      className="h-auto w-5 cursor-pointer text-slate-700"
                    />
                  )
                },
              },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Space className="flex justify-end">
            <SubmitButton
              form={form}
              loading={crearPedidoMt.isPending}
              disabled={items.length <= 0}
            >
              {crearPedidoMt.isPending ? 'Creando pedido...' : 'Crear pedido'}
            </SubmitButton>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

interface SubmitButtonProps {
  form: FormInstance
  loading: boolean
  disabled?: boolean
}

const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({
  // form,
  children,
  loading,
  // disabled,
}) => {
  // const [submittable, setSubmittable] = useState<boolean>(false)

  // Watch all values
  // const values = Form.useWatch([], form)

  // useEffect(() => {
  //   form
  //     .validateFields({ validateOnly: true })
  //     .then(() => setSubmittable(true))
  //     .catch(() => setSubmittable(false))
  // }, [form, values])

  return (
    <Button
      type="primary"
      htmlType="submit"
      // disabled={!submittable || disabled}
      loading={loading}
    >
      {children}
    </Button>
  )
}
