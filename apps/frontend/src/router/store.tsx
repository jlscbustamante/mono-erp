import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import {
  GenerateAccountStore,
  SignMovements,
  StorePaymentMethods,
  StoresLayout,
  StoresStates,
} from './lazyImports'

export const storesPahts = {
  _: '/stores',
  signmovements: '/stores/signmovements',
  states: '/stores/states',
  generateaccount: '/stores/generateaccount',
  paymentMethods: '/stores/paymentmethods',
}

export const storeRouter: RouteObject = {
  path: storesPahts._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <StoresLayout />
    </Suspense>
  ),
  children: [
    {
      path: storesPahts.signmovements,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <SignMovements />
        </Suspense>
      ),
    },
    {
      path: storesPahts.states,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <StoresStates />,
        </Suspense>
      ),
    },
    {
      path: storesPahts.generateaccount,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <GenerateAccountStore />,
        </Suspense>
      ),
    },
    {
      path: storesPahts.paymentMethods,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <StorePaymentMethods />
        </Suspense>
      ),
    },
  ],
}
