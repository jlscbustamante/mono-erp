import { CreateDriverDrawer } from './create-driver-drawer'
import { DriverHeader } from './driver-header'
import { DriverTable } from './driver-table'
import { UpdateDriverDrawer } from './update-driver-drawer'

export const Driver = () => {
  return (
    <div className="p-3">
      <DriverHeader />
      <DriverTable />
      <CreateDriverDrawer />
      <UpdateDriverDrawer />
    </div>
  )
}
