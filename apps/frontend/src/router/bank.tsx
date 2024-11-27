import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import {
  BankLayout,
  BenchFixing,
  BenchFixingBcp,
  Deposit,
  InfoTable,
  PaymentRequest,
} from './lazyImports'

export const bankPahts = {
  _: '/bank',
  deposit: `/bank/deposit`,
  benchFixing: { _: '/bank/benchfixing', bcp: '/bank/benchfixing/bcp' },
  paymentRequest: '/bank/paymentrequest',
  infoTable: '/bank/infodata',
}

export const bankRouter: RouteObject = {
  path: bankPahts._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      {' '}
      <BankLayout />
    </Suspense>
  ),
  children: [
    {
      path: bankPahts.deposit,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Deposit />
        </Suspense>
      ),
    },
    {
      path: bankPahts.benchFixing._,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <BenchFixing />
        </Suspense>
      ),
    },
    {
      path: bankPahts.benchFixing.bcp,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <BenchFixingBcp />
        </Suspense>
      ),
    },
    {
      path: bankPahts.paymentRequest,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <PaymentRequest />
        </Suspense>
      ),
    },
    {
      path: bankPahts.infoTable,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <InfoTable />
        </Suspense>
      ),
    },
  ],
}
