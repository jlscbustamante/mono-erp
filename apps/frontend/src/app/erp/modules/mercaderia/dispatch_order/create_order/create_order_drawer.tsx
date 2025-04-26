import { CustomDatePicker } from '@/components/ant_form/custom_datepicker'
import { SucursalesSelect } from '@/components/selects/inventory/sucursales-select'
import { viewClient } from '@/lib/rpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { IItem, InvDispatchInsert, InvDispatchItemInsert } from '@types'
import { Button, Divider, Drawer, Form, Input, Modal } from 'antd'
import { format } from 'date-fns'
import { atom, useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { IItemToCreateDto, ListDispatchDrawer } from './list_dispatch_drawer'

const create_order_atom = atom(false)

export const useCreateOrderDrawer = () => {
  const [value, set_value] = useAtom(create_order_atom)

  return {
    open: value,
    open_change: (open: boolean) => {
      set_value(open)
    },
  }
}

type T = keyof InvDispatchInsert

export function CreateOrderDrawer() {
  const { open, open_change } = useCreateOrderDrawer()
  const [open_list, set_list] = useState(false)
  const [form] = Form.useForm<InvDispatchInsert>()
  const [items, set_items] = useState<IItemToCreateDto[]>([])

  const total = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + item.total, 0)
    return sum.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN',
    })
  }, [items])

  const sucursal_to_id = Form.useWatch('sucursal_to_id', form)

  const { data: dispatchable_items } = useQuery({
    queryKey: ['items_to_dispatch', sucursal_to_id],
    enabled: !!sucursal_to_id,
    queryFn: async () => {
      const request =
        await viewClient.api.view.inventory.get_items_to_dispatch.$get({
          query: {
            warehouse_id: sucursal_to_id!,
          },
        })
      const data = await request.json()
      if (!request.ok) {
        throw new Error(
          data.message ?? 'No se encontraron items para despachar',
        )
      }
      return data.data as IItem[]
    },
  })

  const create_order_mt = useMutation({
    mutationFn: async (data: {
      dispatch: InvDispatchInsert
      items: InvDispatchItemInsert[]
    }) => {
      const request = await viewClient.api.view.inventory.create_dispatch.$post(
        {
          json: data,
        },
      )
      const data_response = await request.json()
      if (!request.ok) {
        throw new Error(data_response.message ?? 'Error al crear el despacho')
      }
      return data_response
    },
  })

  const handle_save = async () => {
    const values = form.getFieldsValue()
    const items_to_save: InvDispatchItemInsert[] = items.map((item) => {
      return {
        dispatch_id: 0,
        item_id: item.item_id,
        item_name: item.item_name,
        presentation_id: item.presentation_id,
        quantity: item.quantity,
        presentation_name: item.presentation_name,
        measure_id: item.product_measure_id,
        total_value: item.total,
        unit_value: item.store_price,
      } satisfies InvDispatchItemInsert
    })

    await create_order_mt.mutateAsync({
      dispatch: values as InvDispatchInsert,
      items: items_to_save,
    })
  }

  useEffect(() => {
    set_items([])
  }, [sucursal_to_id])

  return (
    <>
      <ListDispatchDrawer
        items={items}
        set_items={set_items}
        open={open_list}
        on_change={(val) => set_list(val)}
        dispatchable_items={dispatchable_items ?? []}
      />
      <Drawer
        title="Crear Despacho de tienda"
        open={open}
        onClose={() => open_change(false)}
        width={800}
      >
        <Form
          name="create_order_store"
          wrapperCol={{ span: 18 }}
          labelCol={{ span: 6 }}
          form={form}
          initialValues={{
            move_at: format(new Date(), 'yyyy-MM-dd'),
          }}
        >
          <Form.Item label="Tienda" name={'sucursal_to_id' satisfies T}>
            <SucursalesSelect />
          </Form.Item>
          <Form.Item label="Fecha de despacho" name={'move_at' satisfies T}>
            <CustomDatePicker props={{ allowClear: false }} />
          </Form.Item>
          <Form.Item label="Descripción" name={'gloss' satisfies T}>
            <Input.TextArea rows={1} />
          </Form.Item>
          <div>
            <Divider>
              <p>
                {items.length} items en la lista.{' '}
                <span
                  className="text-blue-500 hover:underline cursor-pointer"
                  onClick={() => set_list(true)}
                >
                  Ver la lista
                </span>
              </p>
            </Divider>
          </div>
          <div className="flex justify-end mb-3">
            <p>VALOR TOTAL : {total}</p>
          </div>
          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className="flex justify-end"
          >
            <Button
              type="primary"
              // onClick={handle_save}
              onClickCapture={(ev) => {
                ev.preventDefault()
                Modal.confirm({
                  title: 'Crear Despacho',
                  content: '¿Estas seguro de crear el despacho?',
                  onOk: handle_save,
                })
              }}
              htmlType="button"
              disabled={!items.length || !sucursal_to_id}
            >
              Crear
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  )
}
