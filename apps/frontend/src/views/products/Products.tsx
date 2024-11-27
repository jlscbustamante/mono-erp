import { useEffect } from 'react'

import { ControlProduct } from './components/ControlProduct'
import { AddInvProductDrawer } from './components/CreateInvProductDrawer'
import { EditInvProductDrawer } from './components/product/EditInvProductDrawer'
import { TableProduct } from './components/TableProduct'
import { useProduct } from './state/useProduct'

export default function Products() {
  const { store, loadProducts, loadMeasures, loadCategories } = useProduct()

  useEffect(() => {
    // const debounceTimer = setTimeout(() => {
    loadProducts()
    // }, 500)

    // return () => clearTimeout(debounceTimer)
  }, [store.wasUpdateOrCreated])

  useEffect(() => {
    ;(async () => {
      await Promise.all([loadMeasures(), loadCategories()])
    })()
  }, [store.controlLoadResources])

  return (
    <div className="p-3">
      <ControlProduct />
      <TableProduct />
      <AddInvProductDrawer />
      <EditInvProductDrawer />
    </div>
  )
}
