import { useEffect } from 'react'
import {
  useDispatch,
  useDispatchBetweenStoresQuery,
} from '../state/useDispatch'
import { ControlPage } from './components/control-page'
import { CreateMoveDrawer } from './components/create-move-drawer'
import { TableMoves } from './components/table-moves'
import { ViewMoveDrawer } from './components/view-move-drawer'

export default function DispatchStoresPage() {
  const { loadWarehouses } = useDispatch()
  const { refetch } = useDispatchBetweenStoresQuery()

  useEffect(() => {
    ;(async () => {
      await loadWarehouses()
    })()
  }, [])

  return (
    <div className="p-3 space-y-3">
      <ControlPage />
      <TableMoves />
      <CreateMoveDrawer onCreate={refetch} />
      <ViewMoveDrawer />
    </div>
  )
}
