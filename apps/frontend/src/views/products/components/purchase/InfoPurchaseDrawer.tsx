import { useMutation } from '@tanstack/react-query'
import { Button, Drawer, Spin, Table } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { FaWarehouse } from 'react-icons/fa6'
import { MdEdit } from 'react-icons/md'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'

import { storePurchase } from '@/data/hex/inventory'
import { PURCHASE_STATUS } from '@/data/hex/types'
import { IInvPurchase } from '@/data/products/types/purchase'
import { cn, fCurrency } from '@/utils'

import { usePurchase } from '../../state/usePurchase'
import {
  EditPurchaseDrawer,
  useEditPurchaseDrawer,
} from './edit_purchase_drawer'
import style from './infoPurchase.module.css'

export const InfoPurchaseDrawer = () => {
  const { store, getOnePurchase } = usePurchase()
  const [purchase, setPurchase] = useState<IInvPurchase | undefined>(undefined)
  const { open } = useEditPurchaseDrawer()
  const componentRef = useRef(null)
  // const today = dayjs()

  const handleStorePurchase = useMutation({
    mutationFn: storePurchase,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: () => {
      store.setDrawers({ info: false })
      store.setInfoDrawer(undefined)
      store.addControlLoadPurchase()
    },
  })

  const loadOnePurchase = useMutation({
    mutationFn: getOnePurchase,
    onSuccess: (data) => {
      setPurchase(data)
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  // const _hideEdit = useMemo(() => {
  //   if (!purchase) return true
  //   const diff = today.diff(dayjs(purchase.purchaseAt.split(' ')[0]), 'days')
  //   return diff > 3
  // }, [purchase])

  useEffect(() => {
    if (!store.infoPurchaseId) return
    loadOnePurchase.mutate(store.infoPurchaseId)
  }, [store.infoPurchaseId])
  return (
    <>
      <Drawer
        // title="Información de compra"
        title={
          <div className="flex justify-between">
            <p>Información de compra</p>
            <ReactToPrint
              trigger={() => <Button>Imprimir</Button>}
              content={() => componentRef.current}
            />
          </div>
        }
        open={store.drawers.info}
        onClose={() => {
          store.setDrawers({ info: false })
        }}
        width={'900px'}
      >
        {purchase && !loadOnePurchase.isPending && (
          <>
            <div ref={componentRef} className={style.toPrint}>
              <div className="flex items-center justify-between">
                <p className="text-lg">Id de la compra : {purchase.id}</p>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    icon={<MdEdit />}
                    className={
                      cn({
                        hidden:
                          // hideEdit || purchase.status != PURCHASE_STATUS.NEW,
                          purchase.status != PURCHASE_STATUS.NEW,
                      })
                      // purchase.status == PURCHASE_STATUS.NEW ? '' : 'hidden'
                    }
                    onClick={() => {
                      if (purchase.id) open(purchase.id)
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    loading={handleStorePurchase.isPending}
                    onClick={() => {
                      if (purchase.id && purchase.status == 1)
                        handleStorePurchase.mutate(purchase.id)
                    }}
                    className={purchase.status == 1 ? '' : 'hidden'}
                    icon={<FaWarehouse />}
                    title="Almacenar"
                    size="small"
                  >
                    Almacenar
                  </Button>
                </div>
              </div>
              <div
                className="my-4 flex flex-col gap-1"
                style={{ width: '500px' }}
              >
                <div className="grid grid-cols-2">
                  <p>Fecha: </p>
                  <p>{purchase.purchaseAt.split(' ')[0]}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Nombre de proveedor : </p>
                  <p>{purchase.supplierName}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Número de factura :</p>
                  <p>{purchase.numInvoice}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Número de guia:</p>
                  <p>{purchase.numGuide}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Glosa:</p>
                  <p>{purchase.gloss}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Cod. Almacen:</p>
                  <p>{purchase.warehouseId}</p>
                </div>
                <div className="grid grid-cols-2">
                  <p>Registrado por :</p>
                  <p>{purchase.createdBy}</p>
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
                    title: 'Cantidad',
                    dataIndex: 'quantity',
                    align: 'right',
                    onCell: () => {
                      return {
                        width: '120px',
                      }
                    },
                  },
                  {
                    title: 'Valor',
                    dataIndex: 'totalValue',
                    align: 'right',
                    render: (text, record) => {
                      if (record.isSpace) return
                      else if (record.isInfo) {
                        return (
                          <div className="flex justify-end gap-2">
                            <p style={{ fontWeight: 'bold' }}>
                              {record.infoName}
                            </p>
                            <p>{fCurrency(text)}</p>
                          </div>
                        )
                      }
                      return <p>{fCurrency(text)}</p>
                    },
                    onCell: () => {
                      return {
                        align: 'right',
                        width: '160px',
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
                dataSource={(purchase as any).items.concat([
                  { isSpace: true, id: 'space-tb' },
                  {
                    id: 'subtotal-tb',
                    isInfo: true,
                    infoName: 'Subtotal. ',
                    totalValue: purchase.netValue,
                  },
                  {
                    id: 'discount-tb',
                    isInfo: true,
                    infoName: 'Dcto. ',
                    totalValue: purchase.discount * -1,
                  },
                  {
                    infoName: 'IGV',
                    isInfo: true,
                    id: 'tax-tb',
                    totalValue: purchase.taxValue,
                  },
                ])}
                footer={() => (
                  <div className="flex justify-end font-bold">
                    <p>Total: {fCurrency(purchase.totalValue)}</p>
                  </div>
                )}
              />
            </div>
          </>
        )}
        {loadOnePurchase.isPending && (
          <div className="flex flex-col items-center gap-4 my-6">
            <p>Cargando...</p>
            <Spin />
          </div>
        )}
      </Drawer>
      <EditPurchaseDrawer
        onUpdate={() => {
          if (store.infoPurchaseId) loadOnePurchase.mutate(store.infoPurchaseId)
          store.addControlLoadPurchase()
        }}
      />
    </>
  )
}
