import { Suspense } from 'react'
import { RouteObject } from 'react-router'

import LoadingPage from '@/components/LoadingPage'

import {
  DigitizationLayout,
  PaymentBank,
  PaymentCulqi,
  RequestsDigitization,
  UploadFilePayments,
  UploadToRequest,
} from './lazyImports'

export const digitizationPahts = {
  _: '/digitization',
  requests: '/digitization/requests',
  uploadToRequest: '/digitization/uploadtorequest',
  payments: '/digitization/payments',
  paymentCulqi: '/digitization/paymentculqi',
  paymentBank: '/digitization/paymentbank',
}

export const digitizationRouter: RouteObject = {
  path: digitizationPahts._,
  element: (
    <Suspense fallback={<LoadingPage />}>
      <DigitizationLayout />
    </Suspense>
  ),
  children: [
    {
      path: digitizationPahts.requests,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <RequestsDigitization />
        </Suspense>
      ),
    },
    {
      path: digitizationPahts.uploadToRequest,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <UploadToRequest />
        </Suspense>
      ),
    },
    {
      path: digitizationPahts.payments,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <UploadFilePayments />
        </Suspense>
      ),
    },
    {
      path: digitizationPahts.paymentCulqi,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <PaymentCulqi />
        </Suspense>
      ),
    },
    {
      path: digitizationPahts.paymentBank,
      element: (
        <Suspense fallback={<LoadingPage />}>
          <PaymentBank />
        </Suspense>
      ),
    },
  ],
}
