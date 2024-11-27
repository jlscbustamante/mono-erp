export enum DISPATCH_MOVE_TYPE {
  WAREHOUSE_TO_STORE = 'D',
  STORE_TO_STORE = 'M',
  EXCEPTIONAL = 'E',
}
export enum DISPATCH_STATUS {
  NEW = 1,
  APPROVED = 2,
  DISPATCHED = 3,
  CANCELLED = 0,
  INVOICED = 4,
  INVOICED_WITH_TRACKING = 5,
}

export interface Dispatch {
  id: number
  wareToId: string
  wareToName: string
  wareFromId: string
  wareFromName: string
  dispatchAt: string
  numInvoice: string
  numGuide: string
  taxValue: number
  gloss: string
  moveType: DISPATCH_MOVE_TYPE
  netValue: number
  totalValue: number
  status: DISPATCH_STATUS
  requestBy: string
  approvedBy: string
  items: DispatchItem[]
}

export interface DispatchRoute extends Omit<Dispatch, 'items'> {
  route: string
  items: DispatchRouteItem[]
}

export interface DispatchRouteItem extends DispatchItem {
  categoryId: number
  categoryName: string
}

export interface DispatchTransport {
  transportCompanyName: string
  licensePlateNumber: string
  driverDocumentType: string
  driverDocumentNumber: string
  driverFirstName: string
  driverLastName: string
  driverLicenseNumber: string
}

export interface DispatchLegal extends Dispatch, DispatchTransport {}

export interface DispatchItem {
  id: number
  dispatchId: number
  itemId: number
  itemName: string
  presentationId: number
  presentationName: string
  measureId: number
  measureCode: string
  quantity: number
  unitValue: number
  totalValue: number
}

export interface DispatchSummary {
  categoryId: number
  categoryName: string
  itemId: number
  itemName: string
  dates: {
    [date: string]: number
  }
}
