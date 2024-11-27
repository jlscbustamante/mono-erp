import { ControlProductItem } from './components/productItem/ControlProductItemDrawer'
import { AddProductItemDrawer } from './components/productItem/CreateProductItemDrawer'
import { EditProductItemDrawer } from './components/productItem/EditInvProductItemDrawer'
import { TableProductItem } from './components/productItem/TableProductItem'
import { EditPriceDrawer } from './price-list/edit-price'

export default function ProductItemView() {
  return (
    <div className="p-3">
      <ControlProductItem />
      <TableProductItem />
      <AddProductItemDrawer />
      <EditProductItemDrawer />
      <EditPriceDrawer />
    </div>
  )
}
