import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import {
  Approved,
  BalanceCostCenter,
  DetailedBalance,
  GenerateAccount,
  Rejected,
  Requested,
  RequestsLayout,
  SummarizedBalance,
} from './lazyImports'

export const requestsPahts = {
  _: '/requests',
  requested: '/requests/requested',
  approved: '/requests/approved',
  rejected: '/requests/rejected',
  balances: {
    _: '/requests/balances',
    detailed: '/requests/balances/detailed',
    summarized: '/requests/balances/summarized',
    generateaccount: '/requests/balances/generateaccount',
    costcenter: '/requests/balances/costcenter',
    // resumentable: '/requests/balances/resumentable',
  },
}

export const requestRouter: RouteObject = {
  path: requestsPahts._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <RequestsLayout />
    </Suspense>
  ),
  children: [
    {
      path: requestsPahts.requested,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Requested />
        </Suspense>
      ),
    },
    {
      path: requestsPahts.approved,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Approved />
        </Suspense>
      ),
    },
    {
      path: requestsPahts.rejected,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <Rejected />
        </Suspense>
      ),
    },
    {
      path: requestsPahts.balances._,
      children: [
        {
          path: requestsPahts.balances.detailed,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <DetailedBalance />
            </Suspense>
          ),
          index: true,
        },
        {
          path: requestsPahts.balances.summarized,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <SummarizedBalance />
            </Suspense>
          ),
        },
        {
          path: requestsPahts.balances.costcenter,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <BalanceCostCenter />
            </Suspense>
          ),
        },
        {
          path: requestsPahts.balances.generateaccount,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <GenerateAccount />
            </Suspense>
          ),
        },
      ],
    },
  ],
}
