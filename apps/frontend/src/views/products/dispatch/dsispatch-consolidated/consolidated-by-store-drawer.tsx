import { getConsolidateByItem } from '@/data/hex/inventory'
import { fNumber } from '@/utils/formatNumber'
import { useQuery } from '@tanstack/react-query'
import { Button, Drawer, Dropdown, Table } from 'antd'
import { Excel } from 'antd-table-saveas-excel'
import { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { atom, useRecoilState } from 'recoil'
import '../../dispatch/style-prin.css'

interface Data {
  itemId: number
  itemName: string
  date: string
}

const consolidateByStore = atom<null | Data>({
  key: 'consolidatedByStore',
  default: null,
})

export const useConsolidateByStore = () => {
  const [itemId, setItemId] = useRecoilState(consolidateByStore)

  const open = (id: { itemId: number; itemName: string; date: string }) => {
    setItemId(id)
  }
  const close = () => {
    setItemId(null)
  }

  return {
    isOpen: itemId != null,
    data: itemId,
    close,
    open,
  }
}

export const ConsolidatedByStoreDrawer = () => {
  const { isOpen, close, data } = useConsolidateByStore()
  return (
    <Drawer
      title="Consolidado por tienda"
      open={isOpen}
      onClose={close}
      width={600}
    >
      {data && <DrawerContent {...data} />}
    </Drawer>
  )
}

const DrawerContent = (data: Data) => {
  const refList = useRef(null)

  const query = useQuery({
    queryKey: ['consolidate-by-store', data.itemId, data.date],
    queryFn: () => getConsolidateByItem(data.itemId, data.date),
    staleTime: 1000 * 60 * 5,
  })

  const columns = [
    {
      title: 'Tienda',
      dataIndex: 'storeName',
      sorter: (a: any, b: any) => a.storeName.localeCompare(b.storeName),
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity',
      align: 'right',
      render: (val: number) => fNumber(val, 2),
      excelRender: (val: number) => fNumber(val, 2),
      __cellType__: 'TypeNumeric',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Precio Total',
      dataIndex: 'total',
      align: 'right',
      render: (val: number) => fNumber(val, 2),
      excelRender: (val: number) => fNumber(val, 2),
      sorter: (a: any, b: any) => a.total - b.total,
      __cellType__: 'TypeNumeric',
    },
  ] as any

  const handleExportExcel = () => {
    const excel = new Excel()
    const itemName = data.itemName.split('-')[0].trim()
    excel
      .addSheet('Consolidado-tienda')
      .addColumns(columns)
      .addDataSource(query.data ?? [])
      .saveAs(`consolidado-tienda-${itemName}.xlsx`)
  }

  if (query.isLoading) {
    return <div className="my-5 text-center">Cargando...</div>
  }
  if (query.error) {
    return <div className="my-5 text-center">Error : {query.error.message}</div>
  }

  return (
    <div ref={refList} className="print:py-2 print:px-4">
      <div className="mb-3 flex justify-between">
        <p className="print:text-sm">
          {data.itemName} - {data.date}
        </p>
        <Dropdown
          className="print:hidden"
          menu={{
            items: [
              {
                key: '1',
                label: <span>Excel</span>,
                onClick: handleExportExcel,
              },
              {
                key: '2',
                className: 'p-0!',
                rootClassName: 'p-0!',
                label: (
                  <ReactToPrint
                    trigger={() => <span className="block w-full">Pdf</span>}
                    content={() => refList.current}
                  />
                ),
              },
            ],
          }}
        >
          <Button size="small" type="primary">
            Exportar
          </Button>
        </Dropdown>
      </div>
      <Table
        rowKey={'storeCode'}
        bordered
        pagination={false}
        size="small"
        // columns={columns}
        columns={columns.map((el: any) => {
          return {
            ...el,
            onCell: () => {
              return {
                style: {
                  padding: '2px 3px',
                },
              }
            },
          }
        })}
        dataSource={query.data}
      />
      <div className="mt-3 print:hidden">
        Suma total de las cantidades :{' '}
        {query.data?.reduce((a, b) => a + b.quantity, 0)}
      </div>
    </div>
  )
}
