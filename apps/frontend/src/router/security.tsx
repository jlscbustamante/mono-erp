import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import { GetIamRole, GetIamUser, SecurityLayout } from './lazyImports'

export const securityPaths = {
  _: '/security',
  getIamUser: '/security/getIamUser',
  getIamRole: '/security/getIamRole',
}

export const securityRouter: RouteObject = {
  path: securityPaths._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <SecurityLayout />
    </Suspense>
  ),

  children: [
    {
      path: securityPaths.getIamUser,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetIamUser />
        </Suspense>
      ),
    },
    {
      path: securityPaths.getIamRole,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GetIamRole />
        </Suspense>
      ),
    },
  ],
}
