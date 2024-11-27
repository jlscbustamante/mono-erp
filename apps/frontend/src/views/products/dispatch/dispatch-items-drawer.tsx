import { Drawer, Table } from 'antd'
import { atom, useRecoilState } from 'recoil'

import { Dispatch } from '@/data/hex/types'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'

const showItemListAtom = atom<boolean>({
  key: 'showItemListAtom',
  default: false,
})

export const useDispatchItemDrawer = () => {
  const [open, setOpen] = useRecoilState(showItemListAtom)

  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
  }
}

export const DispatchItemsDrawer = ({
  dispatch,
  refList,
}: {
  dispatch: Dispatch
  refList?: any
}) => {
  const { isOpen, close } = useDispatchItemDrawer()
  return (
    <Drawer open={isOpen} onClose={close} width={800}>
      <div ref={refList} className="print:p-3 m-2">
        <Table
          rowKey={'itemId'}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Item de inventario',
              dataIndex: 'itemName',
            },
            {
              title: 'Precio',
              dataIndex: 'unitValue',
              align: 'right',
              render: (val) => fCurrency(val, false),
            },
            {
              title: 'Cantidad',
              dataIndex: 'quantity',
              align: 'right',
              render: (val) => fNumber(val, 3),
            },
            {
              title: 'Total',
              align: 'right',
              dataIndex: 'totalValue',
              render: (val) => fCurrency(val, false),
            },
          ]}
          dataSource={dispatch.items.sort((a, b) =>
            a.itemName.localeCompare(b.itemName),
          )}
        />
      </div>
    </Drawer>
  )
}
