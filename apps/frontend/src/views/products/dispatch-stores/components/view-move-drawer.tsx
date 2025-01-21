import { PrinterOutlined } from '@ant-design/icons'
import { useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { Button, Drawer, Popover, Table, Tag } from 'antd'
import { useMemo, useRef, useState } from 'react'
import { TbTruckDelivery } from 'react-icons/tb'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'
import { atom, useRecoilState } from 'recoil'

import * as sdk from '@/data/products/sdk'
import { dispatchApproveBetweenStores } from '@/data/products/sdk'
import { DispatchStatus, IDispatch, IDispatchItem } from '@/data/products/types'
import { OpFilter } from '@/data/types/Filters'
import { fCurrency } from '@/utils'
import { fNumber } from '@/utils/formatNumber'
import style from '@/views/products/components/purchase/infoPurchase.module.css'

const viewMoveDrawerAtom = atom<number | null>({
  key: 'viewMoveDrawerAtom',
  default: null,
})

export const useViewMoveDrawer = () => {
  const [idDispatch, setOpen] = useRecoilState(viewMoveDrawerAtom)

  return {
    idDispatch,
    open: (idDispatch: number) => setOpen(idDispatch),
    close: () => setOpen(null),
  }
}

export const ViewMoveDrawer = () => {
  const { idDispatch, close } = useViewMoveDrawer()
  const [openList, setOpenList] = useState(false)

  const dispatchQuery = useQuery({
    queryKey: ['dispatch', idDispatch],
    enabled: !!idDispatch,
    queryFn: async () => {
      const dispatch = await sdk.filterDispatch({
        filters: { id: [OpFilter.Equal, idDispatch] },
        relations: {
          wareFrom: true,
          wareTo: true,
          items: true,
        },
      })
      return dispatch?.dispatches[0] ?? undefined
    },
  })

  return (
    <>
      <Drawer open={!!idDispatch} onClose={() => close()} width={800}>
        {dispatchQuery.isPending && (
          <div className="text-center my-2">Cargando...</div>
        )}
        {idDispatch && (
          <DrawerContent
            idDispatch={idDispatch}
            dispatchQuery={dispatchQuery}
            setOpenList={setOpenList}
          />
        )}
      </Drawer>
      <InfoDispatcherItemListDrawer
        open={openList}
        setOpen={setOpenList}
        items={dispatchQuery.data?.items}
      />
    </>
  )
}

const getStatusTag = (status: DispatchStatus) => {
  if (status == DispatchStatus.NEW) return <Tag color="blue">Pedido nuevo</Tag>
  else if (status == DispatchStatus.APPROVED)
    return <Tag color="green">Pedido aprobado</Tag>
  else if (status == DispatchStatus.DISPATCHED)
    return <Tag color="green">Pedido despachado</Tag>
  return <Tag color="red">Pedido anulado</Tag>
}

const DrawerContent = ({
  setOpenList,
  dispatchQuery,
}: {
  idDispatch: number
  setOpenList: (open: boolean) => void
  dispatchQuery: UseQueryResult<IDispatch, Error>
}) => {
  const dispatch = useMemo(() => dispatchQuery.data, [dispatchQuery.data])
  const componentRef = useRef(null)
  const refList = useRef(null)

  const approveDispatchBetweenStoresMt = useMutation({
    mutationFn: dispatchApproveBetweenStores,
    onSuccess: () => {
      dispatchQuery.refetch()
      toast.success('Movimiento despachado')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  return (
    <div>
      {dispatch && (
        <div ref={componentRef} className={style.toPrint}>
          <div className={style.container}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className={`text-lg ${style.idTitle}`}>
                  Id del despacho: {dispatch.id}
                </p>
                {getStatusTag(dispatch.status)}
              </div>
              <div className="flex gap-2 items-center">
                <ReactToPrint
                  trigger={() => (
                    <Button
                      type="primary"
                      icon={<PrinterOutlined />}
                      title="Imprimir lista"
                      size="small"
                    >
                      Imprimir lista
                    </Button>
                  )}
                  content={() => refList.current}
                />
                {dispatch.status == DispatchStatus.APPROVED && (
                  <Button
                    type="primary"
                    onClick={() =>
                      approveDispatchBetweenStoresMt.mutate(dispatch.id)
                    }
                    loading={approveDispatchBetweenStoresMt.isPending}
                    icon={<TbTruckDelivery />}
                    title="Editar"
                    size="small"
                  >
                    Despachar
                  </Button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 my-4">
              <div className={`flex flex-col gap-1 ${style.desc}`}>
                <div className="grid grid-cols-2">
                  <p>Fecha de despacho: </p>
                  <p>{dispatch.moveAt.split(' ')[0]}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Origen: </p>
                  <p>{dispatch.wareFrom?.name}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Destino: </p>
                  <p>{dispatch.wareTo?.name}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Número de guia:</p>
                  <p>{dispatch.numGuide}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Número de factura:</p>
                  <p>{dispatch.numInvoice}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Registrado por :</p>
                  <p>{dispatch.createdBy}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Descripción:</p>
                  <Popover
                    content={<div className="w-72">{dispatch.gloss}</div>}
                    trigger={'hover'}
                  >
                    <p className="truncate">{dispatch.gloss}</p>
                  </Popover>
                </div>
              </div>
            </div>
            <Table
              pagination={false}
              size="small"
              rowKey={'id'}
              columns={[
                {
                  title: 'Item de inventario',
                  dataIndex: 'itemName',
                },
                {
                  title: '',
                  width: 80,
                  render: (record) => {
                    if (record.id == 'total-items-tb') {
                      return (
                        <a
                          onClick={() => {
                            setOpenList(true)
                          }}
                        >
                          Ver lista
                        </a>
                      )
                    }
                    return null
                  },
                },
                {
                  title: 'Valor',
                  dataIndex: 'totalValue',
                  align: 'right',
                  render: (text, record) => {
                    if (record.isSpace) return
                    return <p>{fCurrency(text)}</p>
                  },
                  onCell: () => {
                    return {
                      align: 'right',
                      width: '120px',
                    }
                  },
                },
              ]}
              onRow={(option: any) => {
                if (option.isSpace)
                  return {
                    height: 80,
                    style: {},
                  }
                return {}
              }}
              dataSource={(
                [
                  {
                    id: 'total-items-tb',
                    itemName: `${dispatch.items?.length} Item(s)`,
                    totalValue: dispatch.netValue,
                  },
                ] as any
              ).concat([
                { isSpace: true, id: 'space-tb' },
                {
                  itemName: 'IGV',
                  id: 'tax-tb',
                  totalValue: dispatch.taxValue,
                },
              ])}
              footer={() => (
                <div className="flex justify-end font-bold">
                  <p>
                    Valor total del despacho: {fCurrency(dispatch.totalValue)}
                  </p>
                </div>
              )}
            />
          </div>
        </div>
      )}
      <ItemList items={dispatch?.items ?? []} refList={refList} />
    </div>
  )
}

const ItemList = ({
  items = [],
  refList,
}: {
  items: IDispatchItem[]
  refList: any
}) => {
  return (
    <div ref={refList} className="p-10 hidden print:block">
      <Table
        pagination={false}
        size="small"
        rowKey={'id'}
        dataSource={items.sort((a, b) => a.itemName.localeCompare(b.itemName))}
        columns={[
          {
            title: 'Item de inventario',
            dataIndex: 'itemName',
          },
          {
            title: 'Cantidad',
            dataIndex: 'quantity',
            align: 'right',
          },
        ]}
      />
    </div>
  )
}

const InfoDispatcherItemListDrawer: React.FC<{
  open: boolean
  setOpen: (open: boolean) => void
  items?: IDispatchItem[]
}> = ({ open, setOpen, items = [] }) => {
  return (
    <Drawer
      closable={true}
      placement="right"
      open={open}
      onClose={() => setOpen(false)}
      width={750}
    >
      <div>
        <Table
          pagination={false}
          size="small"
          rowKey={'id'}
          dataSource={items}
          columns={[
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
              render: (value) => fNumber(value, 3),
            },
            {
              title: 'Total',
              dataIndex: 'totalValue',
              render: (value) => fNumber(value),
            },
          ]}
        />
      </div>
    </Drawer>
  )
}
