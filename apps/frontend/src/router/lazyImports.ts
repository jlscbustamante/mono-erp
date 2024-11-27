import { lazy } from 'react'

export const ResetPassword = lazy(() => import('@/views/auth/resetPassword'))

export const RequestsLayout = lazy(() => import('../layout/RequestsLayout'))
export const Approved = lazy(() => import('@/views/requests/Approved'))
export const DetailedBalance = lazy(
  () => import('@/views/requests/balances/Detailed'),
)
export const BalanceCostCenter = lazy(
  () => import('@/views/requests/balances/CostCenter'),
)
export const GenerateAccount = lazy(
  () => import('@/views/requests/balances/GenerateAccount'),
)
export const SummarizedBalance = lazy(
  () => import('@/views/requests/balances/Summarized'),
)
export const Rejected = lazy(() => import('@/views/requests/Rejected'))
export const Requested = lazy(() => import('@/views/requests/Requested'))

export const Reports = lazy(() => import('@/views/reports/Reports'))

export const StoresLayout = lazy(() => import('@/layout/StoresLayout'))
export const GenerateAccountStore = lazy(
  () => import('@/views/stores/GenerateAccount'),
)
export const SignMovements = lazy(() => import('@/views/stores/SignMovements'))
export const StoresStates = lazy(() => import('@/views/stores/States'))
export const StorePaymentMethods = lazy(
  () => import('@/views/stores/PaymentMethods'),
)

export const MaintenanceLayout = lazy(() => import('@/layout/Maintenance'))
export const GetCashAccount = lazy(
  () => import('@/views/maintenance/Get/GetCashAccount'),
)
export const GetCategory = lazy(
  () => import('@/views/maintenance/Get/GetCategory'),
)
export const GetCostCenter = lazy(
  () => import('@/views/maintenance/Get/GetCostCenter'),
)
export const GetMenuReport = lazy(
  () => import('@/views/maintenance/Get/GetMenuReport'),
)
export const GetParameters = lazy(
  () => import('@/views/maintenance/Get/GetParameters'),
)
export const GetSucursal = lazy(
  () => import('@/views/maintenance/Get/GetSucursal'),
)
export const GetSupplier = lazy(
  () => import('@/views/maintenance/Get/GetSupplier'),
)
export const GetTerminalPost = lazy(
  () => import('@/views/maintenance/Get/GetTerminalPost'),
)

export const GetDriver = lazy(() => import('@/views/maintenance/Get/GetDriver'))

export const UpdatePassword = lazy(() => import('@/views/auth/UpdatePassword'))
export const GetTypeCashAccount = lazy(
  () => import('@/views/maintenance/Get/GetTypeCashAccount'),
)
export const GetTypeCategory = lazy(
  () => import('@/views/maintenance/Get/GetTypeCategory'),
)
export const GetIamRole = lazy(() => import('@/views/security/Get/GetIamRole'))

export const GetIamUser = lazy(() => import('@/views/security/Get/GetIamUser'))

export const DigitizationLayout = lazy(() => import('../layout/Digitization'))
export const UploadToRequest = lazy(
  () => import('@/views/digitization/UploadToRequest'),
)
export const RequestsDigitization = lazy(
  () => import('@/views/digitization/requests'),
)
export const UploadFilePayments = lazy(
  () => import('@/views/digitization/PaymentsIzipay'),
)
export const PaymentCulqi = lazy(
  () => import('@/views/digitization/PaymentCulqi'),
)
export const PaymentBank = lazy(
  () => import('@/views/digitization/PaymentBank'),
)

export const BankLayout = lazy(() => import('@/layout/BankLayout'))
export const BenchFixing = lazy(() => import('@/views/bank/BenchFixing'))
export const BenchFixingBcp = lazy(() => import('@/views/bank/benchFixing/Bcp'))
export const Deposit = lazy(() => import('@/views/bank/Deposit'))
export const PaymentRequest = lazy(() => import('@/views/bank/PaymentRequest'))

export const InfoTable = lazy(() => import('@/views/bank/InfoTable'))

export const getIIamUser = lazy(() => import('@/views/security/Get/GetIamUser'))
export const getIIamRole = lazy(() => import('@/views/security/Get/GetIamRole'))
export const InventoryStock = lazy(() => import('@/views/products/Stock'))

// products
export const ProductProvider = lazy(() => import('@/views/products/Provider'))
export const ProductLayout = lazy(() => import('@/layout/ProductLayout'))
export const Shipment = lazy(() => import('@/views/products/Shipment'))
export const Products = lazy(() => import('@/views/products/Products'))
export const SecurityLayout = lazy(() => import('@/layout/Security'))
export const EntryGuide = lazy(
  () => import('@/views/products/Consumption/EntryGuide'),
)
export const DailyInventory = lazy(
  () => import('@/views/products/Consumption/DailyInventory'),
)
