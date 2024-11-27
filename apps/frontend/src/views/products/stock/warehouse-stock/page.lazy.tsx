import { lazy } from 'react'

export const WarehouseStockPageLazy = lazy(
  () => import('@/views/products/stock/warehouse-stock/page'),
)
