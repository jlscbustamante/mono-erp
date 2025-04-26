import { filterSelectForm } from '@/utils'
import { IItem } from '@types'
import { Button, Drawer, InputNumber, Select, Table } from 'antd'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

export interface IItemToCreateDto extends IItem {
  quantity: number
  total: number
}

export const ListDispatchDrawer = ({
  open,
  on_change,
  dispatchable_items,
  items,
  set_items,
}: {
  open: boolean
  on_change: (val: boolean) => void
  dispatchable_items: IItem[]
  items: IItemToCreateDto[]
  set_items: (items: IItemToCreateDto[]) => void
}) => {
  const [selected_item, set_selected_item] = useState<IItem | null>(null)

  const handle_add_item = () => {
    if (!selected_item) return
    const exist = items.find((item) => item.item_id == selected_item.item_id)
    if (exist) {
      toast.error('El item ya fue agregado')
    } else {
      set_items([
        ...items,
        {
          ...selected_item,
          quantity: 1,
          total: selected_item.store_price,
        },
      ])
    }
  }

  const handle_remove_items = (item_id: number) => {
    const new_items = items.filter((item) => item.item_id != item_id)
    set_items(new_items)
  }

  const change_quantity = (item_id: number, quantity: number) => {
    const new_items = items.map((item) => {
      if (item.item_id == item_id) {
        return {
          ...item,
          quantity: quantity,
          total: item.store_price * quantity,
        }
      }
      return item
    })
    set_items(new_items)
  }
  return (
    <Drawer
      title="Agrega items al despacho"
      width={780}
      open={open}
      onClose={() => on_change(false)}
    >
      <div className="flex gap-2 mb-3">
        <Select
          className="w-full"
          filterOption={filterSelectForm}
          showSearch
          value={selected_item?.item_id}
          onChange={(val) => {
            const item = dispatchable_items.find((item) => item.item_id == val)
            if (item) {
              set_selected_item(item)
            }
          }}
        >
          {dispatchable_items?.map((item) => (
            <Select.Option key={item.item_id} value={item.item_id}>
              {item.item_name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={handle_add_item}>
          Agregar
        </Button>
      </div>
      <Table
        rowKey={'item_id'}
        pagination={false}
        size="small"
        dataSource={items}
        columns={[
          {
            title: 'Item id',
            dataIndex: 'item_id',
          },
          {
            title: 'Item',
            dataIndex: 'item_name',
          },
          {
            title: 'P.U',
            dataIndex: 'store_price',
          },
          {
            title: 'Cantidad',
            render: (_, record) => {
              return (
                <InputNumber
                  className="w-28"
                  value={record.quantity}
                  min={0}
                  onChange={(val) => change_quantity(record.item_id, val ?? 0)}
                />
              )
            },
          },
          {
            title: 'Total',
            dataIndex: 'total',
            width: 120,
            render: (val: number) => {
              return val.toLocaleString('es-PE', {
                style: 'currency',
                currency: 'PEN',
              })
            },
          },
          {
            title: '',
            render: (_, record) => {
              return (
                <Button
                  ghost
                  size="small"
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    handle_remove_items(record.item_id)
                  }}
                >
                  <Trash className="w-4 text-blue-600" />
                </Button>
              )
            },
          },
        ]}
      />
    </Drawer>
  )
}
