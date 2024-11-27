import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'
import { DispatchStoresPageLazy } from '@/views/products/dispatch-stores/page.lazy'
import { Routes } from '@/views/products/dispatch/route/route'
import { WarehouseStockPageLazy } from '@/views/products/stock/warehouse-stock/page.lazy'
import EditTemplate from '@/views/products/templates/edit/edit-template.page'
import TemplatePage from '@/views/products/templates/page'

import { DispatchRoute } from '@/views/products/dispatch/dispatch-route/dispatch-route'
import { Driver } from '@/views/products/dispatch/driver/driver'
import { DispatchConsolidated } from '@/views/products/dispatch/dsispatch-consolidated/dispatch-consolidated'
import { Ratio } from '@/views/products/dispatch/ratio/ratio'
import { Warehouse } from '@/views/products/dispatch/warehouse/warehouse'
import { WeekComsumption } from '@/views/products/dispatch/week-consumption/week-comsumption'
import { PriceListPage } from '@/views/products/price-list/price-list-page'
import { DailyInventory, EntryGuide, Products, Shipment } from './lazyImports'

const ProductLayout = lazy(() => import('@/layout/ProductLayout'))
const Stock = lazy(() => import('@/views/products/Stock'))
const ProductItem = lazy(() => import('@/views/products/ProductItem'))
const Purchase = lazy(() => import('@/views/products/Purchase'))
const Dispatch = lazy(() => import('@/views/products/Dispatch'))
const ProviderPage = lazy(() => import('@/views/products/provider/page'))
const DispatchTodayPage = lazy(
  () => import('@/views/products/dispatch/dispatchToday'),
)

const BrandMaintenance = lazy(
  () => import('@/views/products/maintenance/Brand'),
)

const CategoryMaintenance = lazy(
  () => import('@/views/products/maintenance/Category'),
)

const PresentationMaintenance = lazy(
  () => import('@/views/products/maintenance/Presentation'),
)

const UnitMaintenance = lazy(() => import('@/views/products/maintenance/Unit'))

const EquivalenceMaintenance = lazy(() => {
  return import('@/views/products/maintenance/Equivalence')
})

export const productsPaths = {
  _: '/products',
  templates: '/products/templates',
  editTemplates: '/products/templates/edit',
  providers: '/products/providers',
  manageWarehouseStock: '/products/warehouse/stock',
  stock: '/products/stock',
  pruchaseItem: '/products/purchase',
  dispatchItem: '/products/dispatch',
  dispatchBetweenStores: '/products/dispatch/stores',
  dispatchByRoutes: '/products/dispatch/routes',
  dispatchConsolidated: '/products/dispatch/consolidated',
  products: '/products/products',
  productItem: '/products/productItem',
  provider: '/products/provider',
  warehouse: '/products/warehouse',
  entryGuide: '/products/consumption/entryGuide',
  dailyInventory: '/products/consumption/dailyInventory',
  dispatchToday: '/products/dispatch/today',
  dispathcRoutes: '/products/dispatch/routes',
  routes: '/products/routes',
  driver: '/products/driver',
  priceList: '/products/inventario/lista-precios',
  maintenance: {
    category: '/products/mant/category',
    brand: '/products/mant/brand',
    presentation: '/products/mant/presentation',
    unit: '/products/mant/unit',
    equivalence: '/products/mant/equivalence',
  },
  report: {
    inventoryByWarehouse: '/products/report/inventoryWarehouse',
    byWeek: '/products/report/byWeek',
    ratio: '/products/report/ratio',
  },
}

export const productRouter: RouteObject = {
  path: productsPaths._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <ProductLayout />
    </Suspense>
  ),
  children: [
    {
      path: productsPaths.manageWarehouseStock,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <WarehouseStockPageLazy />
        </Suspense>
      ),
    },
    {
      path: productsPaths.templates,
      element: <TemplatePage />,
    },
    {
      path: `${productsPaths.editTemplates}/:id`,
      element: <EditTemplate />,
    },
    {
      path: productsPaths.providers,
      element: (
        <Suspense fallback={<LoadingPage />}>
          {/* <GetSupplier small={true} /> */}
          <ProviderPage />
        </Suspense>
      ),
    },
    {
      path: productsPaths.stock,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Stock />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dispatchItem,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Dispatch />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dispatchBetweenStores,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DispatchStoresPageLazy />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dispatchByRoutes,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DispatchRoute />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dispatchConsolidated,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DispatchConsolidated />
        </Suspense>
      ),
    },
    {
      path: productsPaths.pruchaseItem,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Purchase />
        </Suspense>
      ),
    },
    {
      path: productsPaths.provider,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Shipment />
        </Suspense>
      ),
    },
    {
      path: productsPaths.warehouse,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Warehouse />
        </Suspense>
      ),
    },
    {
      path: productsPaths.products,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Products />
        </Suspense>
      ),
    },
    {
      path: productsPaths.priceList,
      element: <PriceListPage />,
    },
    {
      path: productsPaths.productItem,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <ProductItem />
        </Suspense>
      ),
    },
    {
      path: productsPaths.entryGuide,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <EntryGuide />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dailyInventory,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DailyInventory />
        </Suspense>
      ),
    },
    {
      path: productsPaths.dispatchToday,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <DispatchTodayPage />
        </Suspense>
      ),
    },
    {
      path: productsPaths.maintenance.category,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <CategoryMaintenance />
        </Suspense>
      ),
    },
    {
      path: productsPaths.maintenance.brand,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <BrandMaintenance />
        </Suspense>
      ),
    },
    {
      path: productsPaths.maintenance.presentation,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <PresentationMaintenance />
        </Suspense>
      ),
    },
    {
      path: productsPaths.maintenance.unit,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <UnitMaintenance />
        </Suspense>
      ),
    },
    {
      path: productsPaths.maintenance.equivalence,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <EquivalenceMaintenance />
        </Suspense>
      ),
    },
    {
      path: productsPaths.report.inventoryByWarehouse,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Stock />
        </Suspense>
      ),
    },
    {
      path: productsPaths.report.byWeek,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <WeekComsumption />
        </Suspense>
      ),
    },
    {
      path: productsPaths.report.ratio,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Ratio />
        </Suspense>
      ),
    },
    {
      path: productsPaths.routes,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Routes />
        </Suspense>
      ),
    },
    {
      path: productsPaths.driver,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Driver />
        </Suspense>
      ),
    },
  ],
}
