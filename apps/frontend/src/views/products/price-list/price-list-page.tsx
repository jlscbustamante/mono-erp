import { EditPriceDrawer } from './edit-price'
import { PrincipalListTable } from './table-items'

export const PriceListPage = () => {
  return (
    <div className="p-3">
      <PrincipalListTable />
      <EditPriceDrawer />
    </div>
  )
}
