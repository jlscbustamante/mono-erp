import { SucursalType } from '@/data/types'

import { IInvBrand, IInvPresentation, IInvProductItem } from '.'

export interface IInvWarehouse {
  id: string
  name: string
  sucursalId: string
  status: number
  type?: SucursalType
}

export enum DispatchType {
  BetweenStores = 'M',
  WarehouseToStore = 'D',
  Exceptional = 'E',
}

export enum DispatchStatus {
  NEW = '1', // nuevo despacho
  APPROVED = '2', // despacho recibido
  DISPATCHED = '3',
  CANCELED = '0',
  INVOICED = '4',
}
export interface IDispatch {
  id: number
  wareFromId: string
  wareToId: string
  numInvoice?: string | null
  numGuide?: string | null
  gloss: string
  moveAt: string
  netValue: number
  taxValue: number
  docUrl?: string | null
  totalValue: number
  status: DispatchStatus // '1: Nuevo pedido por la tienda; 2: Aprobado por almacen; 3: Recibido por la tienda; 0: Anulado',
  moveType: DispatchType
  createdBy: string
  createdAt: string
  updatedAt: string

  conductor_apellidos?: string
  conductor_nombres?: string
  conductor_nro_doc?: string
  conductor_nro_licencia?: string
  conductor_tipo?: string
  conductor_tipo_doc?: string

  transporte_nro_doc?: string
  transporte_nro_placa: string
  transporte_razon_social?: string
  transporte_tipo_doc?: string

  items?: IDispatchItem[]
  wareFrom?: IInvWarehouse
  wareTo?: IInvWarehouse
}

export interface IDispatchItem {
  id: number
  dispatchId: number
  productId: number
  itemId: number
  itemName: string
  brandId: number
  presentationId: number
  unitValue: number
  quantity: number
  totalValue: number
  createdAt: string
  updatedAt: string
  item?: IInvProductItem
  presentation?: IInvPresentation
  brand?: IInvBrand
  unitPrice?: number
}
