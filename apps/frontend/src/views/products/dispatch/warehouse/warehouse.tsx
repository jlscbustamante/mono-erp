import { CreateDrawer } from './create-drawer'
import { EditDrawer } from './edit-drawer'
import { WarehouseHeader } from './warehouse-header'
import { WarehouseTable } from './warehouse-table'

export const Warehouse = () => {
  return (
    <div className="p-3">
      <WarehouseHeader />
      <WarehouseTable />
      <EditDrawer />
      <CreateDrawer />
    </div>
  )
}
