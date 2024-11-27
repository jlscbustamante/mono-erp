import { RequestType } from '@/data/requests/types'

export const getNameRequestType = (type: RequestType) => {
  switch (type) {
    case RequestType.Simple:
      return 'Simple'
    case RequestType.Supplier:
      return 'Proveedor'
    case RequestType.Transfer:
      return 'Transferencia'
    default:
      return 'Liquidacion'
  }
}
