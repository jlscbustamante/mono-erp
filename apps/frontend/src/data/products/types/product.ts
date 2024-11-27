import { StatusEntityNumber } from '@/data/types'

export interface IInvMeasure {
  id: number

  measure: string

  code: string

  status: 1 | 0
}

export interface IInvCategory {
  id: number

  category: string

  priority: number

  status: StatusEntityNumber
}

export interface IInvProduct {
  id: number
  product: string
  categoryId: number
  externalCode: string | null
  measureId: number
  formulaId: number | null
  unitPrice: number
  status: StatusEntityNumber
  createdAt: string
  updatedAt: string
  measure?: IInvMeasure
  category?: IInvCategory | null
}

export interface IInvPresentation {
  id: number
  presentation: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface IInvBrand {
  id: number
  brand: string
  code: string
  status: number
  createdAt: string
  updatedAt: string
}
export interface IInvSupplier {
  id: number
  supplier: string
  legalName: string
  legalNumber: string
  address: string
  legalAccountBco?: string
  legalAccountNum?: string
  legalAccountCci?: string
  legalAccountCur?: string
  legalAccountType?: string
  status: number
}

export enum ItemType {
  DIRECT_SALE = 'D',
  TRANSFORMABLE = 'T',
  PRODUCED = 'P',
}

export enum ItemRelationship {
  PRINCIPAL = 'O',
  DERIVATE = 'D',
}

export interface IInvProductItem {
  id: number
  itemName: string
  productId: number
  brandId: number
  itemType: ItemType
  relationShip: ItemRelationship
  // toDispatch: number | string
  presentationId: number
  supplierId: number
  unitPrice: number
  status: number
  createdAt: string
  updatedAt: string
  brand?: IInvBrand
  presentation?: IInvPresentation
  supplier?: IInvSupplier
  product?: IInvProduct
  measure?: IInvMeasure
  unitCost: number
  measureId: number
}
