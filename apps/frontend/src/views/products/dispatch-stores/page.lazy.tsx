import { lazy } from 'react'

export const DispatchStoresPageLazy = lazy(
  () => import('@/views/products/dispatch-stores/page'),
)
