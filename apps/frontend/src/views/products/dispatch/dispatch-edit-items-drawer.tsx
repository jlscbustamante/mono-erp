import { Button, Drawer, InputNumber, message, Select, Table } from 'antd'
import { useState } from 'react'

import { DispatchItemAddDto, DispatchUpdateDto } from '@/data/hex/types'
import { filterSelectForm } from '@/utils'

import { useItems } from '../hooks/use-items'

interface DispatchItemEdit extends DispatchItemAddDto {
  wasUpdated: boolean
}

export const DispatchEditItemsDrawer = ({
  dispatch,
  onOpenChange,
  open,
  setDispatch,
}: {
  dispatch: DispatchUpdateDto
  onOpenChange: (open: boolean) => void
  open: boolean
  setDispatch: (dispatch: DispatchUpdateDto) => void
}) => {
  const queryItems = useItems()
  const [itemSelected, setItemSelected] = useState(0)
  const [items, setItems] = useState<DispatchItemEdit[]>(
    dispatch.items
      .map((el) => ({
        ...el,
        wasUpdated: false,
      }))
      .sort((a, b) => a.itemName.localeCompare(b.itemName)),
  )
  const onChangeQuantity = (itemId: number, quantity: number) => {
    setItems(
      items.map((el) => {
        if (el.itemId === itemId) {
          const totalValue = Number((quantity * el.unitValue).toFixed(2))
          return {
            ...el,
            quantity,
            totalValue,
            wasUpdated: true,
          }
        }
        return el
      }),
    )
  }

  const removeItem = (itemId: number) => {
    const newItems = items.filter((el) => el.itemId !== itemId)
    setItems(newItems)
  }

  const addItem = () => {
    const itemDb = queryItems.data?.find((el) => el.id === itemSelected)
    if (!itemDb) return
    const alreadyAdded = items.find((el) => el.itemId === itemDb.id)
    if (alreadyAdded) {
      message.warning('El item ya fue agregado')
      return
    }
    const newItems = [
      ...items,
      {
        id: undefined,
        itemId: itemDb.id,
        itemName: itemDb.name,
        unitValue: itemDb.storePrice,
        quantity: 1,
        totalValue: itemDb.storePrice,
        wasUpdated: true,
        dispatchId: dispatch.id,
        measureId: itemDb.measureId,
        presentationId: itemDb.presentationId,
        presentationName: itemDb.presentationName,
      } satisfies DispatchItemEdit,
    ]
    // setItems(newItems.sort((a, b) => a.itemName.localeCompare(b.itemName)))
    setItems(newItems)
    setItemSelected(0)
  }

  return (
    <Drawer
      open={open}
      onClose={() => {
        setDispatch({
          ...dispatch,
          items: items
            .filter((el) => el.quantity > 0)
            .map((el) => ({ ...el, wasUpdated: undefined })),
        })
        onOpenChange(false)
      }}
      width={800}
    >
      <div className="flex items-center gap-2 mb-3">
        <Select
          className="w-full max-w-xl"
          value={itemSelected == 0 ? undefined : itemSelected.toString()}
          onChange={(val) => setItemSelected(+val)}
          size="small"
          filterOption={filterSelectForm}
          showSearch
        >
          {queryItems.data?.map((el) => (
            <Select.Option key={el.id} value={el.id.toString()}>
              {el.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" size="small" onClick={addItem}>
          Agregar
        </Button>
      </div>
      {items.some((el) => el.quantity == 0) && (
        <p className="my-3 text-slate-700">
          * Los items con cantidad 0 no seran enviados
        </p>
      )}
      <Table
        rowKey={'itemId'}
        pagination={false}
        size="small"
        bordered={true}
        dataSource={items}
        onRow={(record) => {
          if (record.wasUpdated) {
            return {
              style: {
                backgroundColor: '#e0f2fe',
              },
            }
          }
          return {}
        }}
        columns={[
          {
            title: 'Id',
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
            render: (val, record: DispatchItemEdit) => {
              return (
                <InputNumber
                  value={val}
                  min={0}
                  precision={3}
                  onChange={(val) => {
                    onChangeQuantity(record.itemId, val)
                  }}
                />
              )
            },
          },
          {
            title: 'Total',
            dataIndex: 'totalValue',
          },
          {
            title: '',
            render: (_, record: DispatchItemEdit) => {
              return (
                <p
                  className="text-blue-500 hover:underline cursor-pointer text-center"
                  onClick={() => removeItem(record.itemId)}
                >
                  Remover
                </p>
              )
            },
          },
        ]}
      />
    </Drawer>
  )
}
