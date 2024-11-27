import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import { Reports } from './lazyImports'

export const reportPaths = {
  _: '/reports',
}

export const reportRouter: RouteObject = {
  path: reportPaths._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <Reports />
    </Suspense>
  ),
}
