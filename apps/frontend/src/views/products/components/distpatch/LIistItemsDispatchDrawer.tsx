import { Button, Drawer, Input, InputNumber, message, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Table } from 'antd/lib'
import { useEffect, useState } from 'react'

import {
  IDispatch,
  IDispatchItem,
  IInvProductItem,
} from '@/data/products/types'
import { fCurrency, filterOption, safeAny } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

import { inventoryApi } from '@/lib/api/inventory'
import { ListTemplateModal } from './ListTemplateModal'

export const ListItemsDispatchDrawer: React.FC<{
  items: (Partial<IInvProductItem> & {
    key: number
    quantity: number
    totalValue: number
  })[]
  dispatch: Partial<IDispatch>
  open: boolean
  onClose: () => void
  addNewItem: (item: Partial<IInvProductItem>) => void
  setNewItems: (items: IDispatchItem[]) => void
  setItems: (
    items: (Partial<IDispatchItem> & {
      key: number
      quantity: number
      totalValue: number
    })[],
  ) => void
}> = ({
  open,
  onClose,
  addNewItem,
  items,
  setItems,
  dispatch,
  setNewItems,
}) => {
  const [selectedItem, setSelectedItem] = useState<
    Partial<IInvProductItem> & { label?: string; value?: string }
  >({})
  const [productItems, setProductItems] = useState<IInvProductItem[]>([])
  const [textField, setTextField] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  const [openModal, setIsOpenModal] = useState(false)
  const columns: ColumnsType<Partial<IDispatchItem> & { key: number }> = [
    {
      title: 'Item de inventario',
      key: 'itemName',
      dataIndex: 'itemName',
    },
    {
      title: 'Medida',
      dataIndex: '_measureCode',
    },
    {
      title: 'P.U.',
      dataIndex: 'unitPrice',
      key: 'unitValue',
    },
    {
      title: 'Q',
      key: 'quantity',
      dataIndex: 'quantity',
      width: 90,
      render: (text, record) => (
        <InputNumber
          value={text}
          min={0}
          size="small"
          precision={2}
          onChange={(e) => {
            // const num: number = isNaN(numTr) ? 0 : numTr
            const num = e == null || e == undefined ? 0 : e

            setItems(
              items.map((i) =>
                i.key === record.key
                  ? {
                      ...i,
                      quantity: num,
                      totalValue: num * (i.unitPrice ?? 0),
                    }
                  : i,
              ),
            )
          }}
        />
      ),
    },
    {
      title: 'P.T.',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 80,
      render: (text) => <p>{fNumber(text)}</p>,
    },
    {
      title: '',
      width: 108,
      render: (_, record) => (
        <a
          href="#"
          onClick={() => {
            setItems(items.filter((i) => i.key !== record.key))
          }}
        >
          Remover
        </a>
      ),
    },
  ]

  useEffect(() => {
    ;(async () => {
      // const list = await getListProductItems()
      const list = await inventoryApi.getItemsTemplate()
      setProductItems(list)
    })()
  }, [])
  return (
    <Drawer placement="right" open={open} onClose={onClose} width={880}>
      {contextHolder}
      <div>
        <div className="">
          <div className="flex gap-1 mb-3">
            <Input
              addonBefore="Item"
              className="w-64"
              placeholder="Buscar en la lista"
              value={textField}
              onChange={(e) => setTextField(e.target.value)}
            />
            <Select
              value={selectedItem.value}
              className="w-64 flex-1"
              placeholder="Selecciona item"
              showSearch
              filterOption={filterOption as safeAny}
              options={productItems.map((el) => ({
                ...el,
                label: el.itemName,
                value: el.id,
              }))}
              onChange={(_, item) => {
                setSelectedItem(item as any)
              }}
            />
            <Button
              type="primary"
              onClick={() => {
                addNewItem(selectedItem)
              }}
            >
              Agregar item
            </Button>
          </div>
          {/* <Button onClick={() => setIsOpenModal(true)}>
            Usar despachos anteriores
          </Button> */}
        </div>
        <Table
          columns={columns}
          dataSource={items.filter((el) => {
            if (!textField) return true
            if (el.itemName?.toLowerCase().includes(textField.toLowerCase()))
              return true
            return false
          })}
          pagination={false}
          footer={() => (
            <div className="flex justify-between font-bold">
              <p>{items.length} item(s)</p>
              <p>Total: {fCurrency(dispatch.netValue ?? 0)}</p>
            </div>
          )}
        />
      </div>
      {openModal && (
        <ListTemplateModal
          dispatch={dispatch}
          setIsOpen={setIsOpenModal}
          selectItems={setNewItems}
          messageApi={messageApi}
        />
      )}
    </Drawer>
  )
}
