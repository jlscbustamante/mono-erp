import { useEffect } from 'react'

import { ControlDispatch } from './components/distpatch/ControlDispatch'
import { DispatchTable } from './components/distpatch/DispatchTable'
import { DispatchDetailDrawer } from './dispatch/dispatch-detail-drawer'
import { useDispatch, useDispatchQuery } from './state/useDispatch'

export default function DispatchConsulta() {
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
      {/* <WarehouseAlert /> */}
      <ControlDispatch />
      <DispatchTable onUpdate={() => refetch()} onlyQuery={true} />
      {/* <CreateDispatchDrawer /> */}
      {/* <LoadDispatchDrawer /> */}
      {/* <InfoDispatchDrawer /> */}
      <DispatchDetailDrawer onUpdate={() => refetch()} onlyQuery={true} />
      {/* <DispatchEditDrawer onUpdate={() => refetch()} /> */}
    </div>
  )
}
