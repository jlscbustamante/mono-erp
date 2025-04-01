import { useRef } from 'react'
import '../products/dispatch/style-prin.css'
import { ControlProductItem } from './components/productItem/ControlProductItemDrawer'
import { AddProductItemDrawer } from './components/productItem/CreateProductItemDrawer'
import { EditProductItemDrawer } from './components/productItem/EditInvProductItemDrawer'
import { TableProductItem } from './components/productItem/TableProductItem'
import { EditPriceDrawer } from './price-list/edit-price'

export default function ProductItemView() {
  const ref_table = useRef(null)

  return (
    <div className="p-3">
      <ControlProductItem ref_table={ref_table} />
      <TableProductItem ref_table={ref_table} />
      <AddProductItemDrawer />
      <EditProductItemDrawer />
      <EditPriceDrawer />
    </div>
  )
}
