import { useEffect } from 'react'

import { ControlPurchase } from './components/purchase/ControlPurchase'
import { CreatePurchaseDrawer } from './components/purchase/CreatePurchaseDrawer'
import { InfoPurchaseDrawer } from './components/purchase/InfoPurchaseDrawer'
import { TablePurchase } from './components/purchase/TablePurchase'
import { useProductItem } from './state/useProductItem'
import { usePurchase } from './state/usePurchase'

export default function Purchase() {
  const { store, loadPurchases } = usePurchase()

  const { store: productItemStore, loadSuppliers } = useProductItem()
  useEffect(() => {
    ;(async () => {
      await loadSuppliers()
    })()
  }, [store.controlLoadResources])

  useEffect(() => {
    // const debounceTimer = setTimeout(() => {
    loadPurchases()
    // }, 500)

    // return () => clearTimeout(debounceTimer)
  }, [store.controlLoadPurchase])

  return (
    <div className="p-3">
      <ControlPurchase />
      <TablePurchase />
      <CreatePurchaseDrawer suppliers={productItemStore.suppliers} />
      <InfoPurchaseDrawer />
    </div>
  )
}
