import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import {
  GetCashAccount,
  GetCategory,
  GetCostCenter,
  GetMenuReport,
  GetParameters,
  GetSucursal,
  GetSupplier,
  GetTerminalPost,
  GetTypeCashAccount,
  GetTypeCategory,
  MaintenanceLayout,
} from './lazyImports'

export const maintenancePaths = {
  _: '/maintenance',
  getCostCenter: '/maintenance/getCostCenter',
  getTypeCashAccount: '/maintenance/getTypeCashAccount',
  getTypeCategory: '/maintenance/getTypeCategory',
  getCashAccount: '/maintenance/getCashAccount',
  getMenuReport: '/maintenance/getMenuReport',
  getParameters: '/maintenance/getParameters',
  getSucursal: '/maintenance/getSucursal',
  getSupplier: '/maintenance/getSupplier',
  getTerminalPost: '/maintenance/getTerminalPost',
  getCategory: '/maintenance/getCategory',
  getDriver: '/maintenance/getDriver',
}

const CourierPage = lazy(
  async () => await import('@/views/maintenance/Get/courier'),
)

export const maintenanceRouter: RouteObject = {
  path: maintenancePaths._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <MaintenanceLayout />
    </Suspense>
  ),

  children: [
    {
      path: maintenancePaths.getCostCenter,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetCostCenter />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getTypeCashAccount,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetTypeCashAccount />,
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getTypeCategory,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetTypeCategory />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getCashAccount,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetCashAccount />,
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getMenuReport,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetMenuReport />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getParameters,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetParameters />,
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getSucursal,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetSucursal />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getSupplier,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetSupplier />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getTerminalPost,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetTerminalPost />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getCategory,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetCategory />
        </Suspense>
      ),
    },
    {
      path: maintenancePaths.getDriver,
      element: (
        <Suspense fallback={<LoadingPage />}>
          {/* <GetDriver /> */}
          <CourierPage />
        </Suspense>
      ),
    },
  ],
}
