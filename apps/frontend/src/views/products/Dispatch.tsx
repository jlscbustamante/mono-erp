import { useEffect } from 'react'

import { CreateOrderDrawer } from '@/app/erp/modules/mercaderia/dispatch_order/create_order/create_order_drawer'
import { ControlDispatch } from './components/distpatch/ControlDispatch'
import { CreateDispatchDrawer } from './components/distpatch/CreateDispatchDrawer'
import { DispatchTable } from './components/distpatch/DispatchTable'
import { WarehouseAlert } from './components/distpatch/warehouse_alert'
import { DispatchDetailDrawer } from './dispatch/dispatch-detail-drawer'
import { useDispatch, useDispatchQuery } from './state/useDispatch'

export default function Dispatch() {
  const { loadWarehouses, store } = useDispatch()
  const { refetch } = useDispatchQuery()
  useEffect(() => {
    ;(async () => {
      await loadWarehouses()
    })()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      refetch()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [store.controlUpdateOrCreated])

  return (
    <div className="p-3">
      <WarehouseAlert />
      <ControlDispatch />
      <DispatchTable onUpdate={() => refetch()} />
      <CreateDispatchDrawer />
      {/* <LoadDispatchDrawer /> */}
      {/* <InfoDispatchDrawer /> */}
      <DispatchDetailDrawer onUpdate={() => refetch()} />
      {/* <DispatchEditDrawer onUpdate={() => refetch()} /> */}
      <CreateOrderDrawer />
    </div>
  )
}
