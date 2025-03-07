import { baseUrl } from '@/data/api/baseUrl'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import { IUserFilters3 } from '@/data/types/Filters'

import {
  DispatchStatus,
  IDispatch,
  IInvBrand,
  IInvCategory,
  IInvMeasure,
  IInvPresentation,
  IInvProduct,
  IInvProductItem,
  IInvSupplier,
  IInvWarehouse,
} from '../types'
import { IInvPurchase } from '../types/purchase'

export const products = async (filters: IUserFilters3<IInvProduct>) => {
  return baseUrl<{
    products: IInvProduct[]
    totalPages?: number
    count: number
    page?: number
  }>('inventory/products/filter', {
    method: 'POST',
    body: filters,
  })
}

export const productItems = async (filters: IUserFilters3<IInvProductItem>) => {
  return baseUrl<{
    items: IInvProductItem[]
    totalPages: number
    count: number
  }>('inventory/product-item/filter', {
    method: 'POST',
    body: filters,
  })
}

export const itemsInTemplate = async (): Promise<IInvProductItem[]> => {
  const data = await baseUrl<IInvProductItem[]>(
    'lt/inventory/template/itemsDispatch',
  )
  return data
}

export const createProduct = async (data: Partial<IInvProduct>) => {
  return baseUrl<void>('inventory/product', {
    method: 'POST',
    body: data,
  })
}

export const createPurchase = async (data: Partial<IInvPurchase>) => {
  return baseUrl<void>('inventory/purchase/create', {
    method: 'POST',
    body: data,
  })
}

export const deletePurchase = async (id: number) => {
  return baseUrl<void>(`inventory/purchase/delete`, {
    body: { id },
    method: 'DELETE',
  })
}

export const createProductItem = async (data: Partial<IInvProductItem>) => {
  return baseUrl<{ id: number }>('inventory/product-item/create', {
    method: 'POST',
    body: data,
  })
}

export const deleteProduct = async (
  id: number,
): Promise<{ message: string }> => {
  return baseUrl(`inventory/product/delete`, {
    method: 'DELETE',
    body: { id },
  })
}

export const deleteProductItem = async (
  id: number,
): Promise<{ message: string }> => {
  return baseUrl(`inventory/product-item/delete`, {
    method: 'DELETE',
    body: { id },
  })
}

export const categories = async () => {
  return baseUrl<IInvCategory[]>('inventory/categories', {
    method: 'GET',
  })
}
export const measures = async () => {
  return baseUrl<IInvMeasure[]>('inventory/measures', {
    method: 'GET',
  })
}

export const brands = async () => {
  return baseUrl<IInvBrand[]>('inventory/brand/get', {
    method: 'GET',
  })
}

export const purchases = async (filters: IUserFilters3<IInvPurchase>) => {
  return baseUrl<{
    purchases: IInvPurchase[]
    totalPages: number
    count: number
  }>('inventory/purchase/filter', {
    method: 'POST',
    body: filters,
  })
}

export const presentations = async () => {
  return baseUrl<IInvPresentation[]>('inventory/presentation/get', {
    method: 'GET',
  })
}

export const suppliers = async () => {
  return baseUrl<IInvSupplier[]>('inventory/supplier/get', {
    method: 'GET',
  })
}

export const createInvCategory = async (category: Partial<IInvCategory>) => {
  return baseUrl<IInvCategory>('inventory/category/create', {
    method: 'POST',
    body: category,
  })
}

export const createSupplier = async (supplier: Partial<IInvSupplier>) => {
  return baseUrl<{ id: number }>('inventory/supplier/create', {
    method: 'POST',
    body: supplier,
  })
}

export const supplierEdit = async (supplier: Partial<IInvSupplier>) => {
  return baseUrl<void>('inventory/supplier/edit', {
    method: 'PUT',
    body: supplier,
  })
}

export const createInvMeasure = async (measure: Partial<IInvMeasure>) => {
  return baseUrl<{ id: number }>('inventory/measure', {
    method: 'POST',
    body: measure,
  })
}

export const createBrand = async (brand: Partial<IInvBrand>) => {
  return baseUrl<IInvBrand>('inventory/brand/create', {
    method: 'POST',
    body: brand,
  })
}

export const createDispatch = async (dispatch: Partial<IDispatch>) => {
  return baseUrl<IInvBrand>('inventory/dispatch/createOne', {
    method: 'POST',
    body: dispatch,
  })
}

export const filterDispatch = async (filters: IUserFilters3<IDispatch>) => {
  return baseUrl<{
    dispatches: IDispatch[]
    count: number
    totalPages?: number
    page?: number
  }>('inventory/dispatch/filter', {
    method: 'POST',
    body: filters,
  })
}

export const createPresentation = async (brand: Partial<IInvPresentation>) => {
  return baseUrl<IInvBrand>('inventory/presentation/create', {
    method: 'POST',
    body: brand,
  })
}

export const getOneProduct = async (id: number) => {
  return baseUrl<IInvProduct>(`inventory/product/getOne/${id}`)
}

export const getOneProductItem = async (id: number) => {
  return baseUrl<IInvProductItem>(`inventory/product-item/getOne/${id}`)
}
export const editProduct = async (product: IInvProduct) => {
  return baseUrl<void>('inventory/product/edit', {
    method: 'PUT',
    body: product,
  })
}

export const editProductItem = async (product: IInvProductItem) => {
  return baseUrl<void>('inventory/product-item/edit', {
    method: 'PUT',
    body: product,
  })
}

export const getSucursalList = () => {
  return baseUrl<ISucursal[]>('inventory/sucursalList')
}

export const getItemsInventario = () => {
  return baseUrl<IInvProductItem[]>('inventory/getItemsInventario')
}

export const createWarehouse = (warehousee: Partial<IInvWarehouse>) => {
  return baseUrl<void>('inventory/warehouse/create', {
    method: 'POST',
    body: warehousee,
  })
}

export const warehouseFilter = (filters: IUserFilters3<IInvWarehouse>) => {
  return baseUrl<{
    warehouses: IInvWarehouse[]
    count: number
    totalPage: number
  }>('inventory/warehouse/filter', {
    method: 'POST',
    body: filters,
  })
}

export const approveDispatch = async (id: number) => {
  return baseUrl<void>(`inventory/dispatch/approve/${id}`, {
    method: 'POST',
  })
}

export const saveApproveAndTransportista = async (id: number, data: any) => {
  return baseUrl<void>(`inventory/dispatch/saveTransportistaAndApprove/${id}`, {
    method: 'POST',
    body: data,
  })
}

export const pdfIsAvailable = async (urlPdf: string) => {
  return baseUrl<{ isAvailable: boolean }>(
    'inventory/dispatch/pdfIsAvailable',
    {
      method: 'GET',
      query: { url: urlPdf },
    },
  )
}

export const getOrGenerateGuideDoc = async (
  id: number,
): Promise<{ docUrl: string }> => {
  return baseUrl<{ docUrl: string }>(
    `inventory/dispatch/getOrGenrateGuideDoc/${id}`,
    {
      method: 'GET',
    },
  )
}

export const updateDispatch = async (dispatch: any) => {
  return baseUrl<void>('inventory/dispatch/update', {
    body: dispatch,
    method: 'PUT',
  })
}

export const updateDispatchAndApprove = async (dispatch: any) => {
  return baseUrl<void>('inventory/dispatch/updateAndApprove', {
    body: dispatch,
    method: 'PUT',
  })
}

export const getListDispatchToday = (date: string) => {
  return baseUrl<{ id: string; title: string; count: number }[]>(
    'inventory/dispatch/getToday',
    {
      query: { date },
      method: 'GET',
    },
  )
}

export const rejectDispatch = async (
  id: number,
): Promise<{ message: string }> => {
  return baseUrl('inventory/dispatch/reject', {
    body: { id },
    method: 'PUT',
  })
}

export const createDispatchToday = (data: {
  date: string
  sucursalId: string
  sucursalNombre: string
}) => {
  return baseUrl('inventory/dispatch/createDispatchFromTemplate', {
    method: 'POST',
    body: data,
  })
}

export const dispatchUpdateState = (id: number, state: DispatchStatus) => {
  return baseUrl<void>(`inventory/dispatch/updateState`, {
    method: 'PUT',
    body: { id, status: state },
  })
}

export const dispatchApproveState = (id: number) => {
  return baseUrl<void>(`ext/dispatch/approve`, {
    method: 'POST',
    body: { id },
  })
}

export const dispatchApproveBetweenStores = (id: number) => {
  return baseUrl<void>(`ext/dispatch/approveBetweenStores`, {
    method: 'POST',
    body: { id },
  })
}

export enum TemplateType {
  Store = 'D',
  Warehouse = 'W',
}

export const getTemplateBase = () => {
  return baseUrl<
    {
      id: number
      name: string
      type: TemplateType
    }[]
  >('lt/inventory/templatesBase/list', {
    method: 'GET',
  })
}

export const getListItemsTemplate = (id: number) => {
  return baseUrl<IListTemplate>('lt/inventory/template/itemList', {
    method: 'GET',
    query: { id },
  })
}

export const updateItemTemplate = (data: any) => {
  return baseUrl<void>('lt/inventory/template/item/update', {
    body: data,
    method: 'PUT',
  })
}

export const createItemTemplate = (data: any) => {
  return baseUrl<void>('lt/inventory/template/item/create', {
    body: data,
    method: 'POST',
  })
}

export const deleteItemTemplate = (id: number) => {
  return baseUrl<void>('lt/inventory/template/item/delete', {
    body: { id },
    method: 'DELETE',
  })
}

export interface DispatchCreateItem {
  itemId: number
  quantity: number
}

export interface DispatchCreate {
  storeId: string
  storeFromId: string
  gloss: string
  moveAt: string
  items: DispatchCreateItem[]
}

export const createDispatchBetweenStores = (data: DispatchCreate) => {
  return baseUrl<number>('inventory/dispatch/createBetweenStores', {
    method: 'POST',
    body: data,
  })
}

export const getTemplateNewStockWarehouse = async ({
  date,
  sucursalCode,
}: {
  date: string
  sucursalCode: string
}) => {
  return baseUrl<{ isNew: boolean; base: ITemplateItem[] }>(
    'ext/stock/warehouse/newStock',
    {
      query: { date, sucursalCode },
    },
  )
}
export const getLastStockWarehouse = async (sucursalCode: string) => {
  return baseUrl<string | null>('ext/warehouse/lastStock', {
    query: { sucursalCode },
  })
}

export interface ITemplateItem {
  id?: number
  item_id: number
  item_name: string
  presentation_id: number
  presentation_name: string
  measure_id: number
  stock_last: number
  stock_current: number
  stock_physical: number
  unit_value: number
  total_value: number
  warehouse_id: string
  stock_at: string
  quantity_in: number
  quantity_out: number
  categoryName: string
}

export interface IStockStore {
  isEmpty: boolean
  stock: ITemplateItem[]
}

export const getStockByStore = (sucursalCode: string, date: string) => {
  return baseUrl<IStockStore>('ext/stock/store/getStock', {
    query: { sucursalCode, date, type: 'PIZZARAUL' },
    method: 'GET',
  })
}

export const getAnyStockByStore = (sucursalCode: string, date: string) => {
  return baseUrl<IStockStore>('ext/stock/store/getAnyStatusStock', {
    query: { sucursalCode, date, type: 'PIZZARAUL' },
    method: 'GET',
  })
}

export const getStockByWarehouse = ({
  sucursalCode,
  date,
}: {
  sucursalCode: string
  date: string
}) => {
  return baseUrl<{ isEmpty: boolean; stock: ITemplateItem[] }>(
    'ext/stock/store/getStockWarehouse',
    {
      query: { sucursalCode, date, type: 'PIZZARAUL' },
      method: 'GET',
    },
  )
}

export const saveNewStock = (inventario: ITemplateItem[]) => {
  return baseUrl<void>('ext/stock/store/saveStock', {
    method: 'POST',
    body: {
      inventario: inventario.filter((el) => el.stock_physical != 0),
    },
  })
}

export const updatStock = (inventario: Partial<ITemplateItem>[]) => {
  return baseUrl<void>('ext/stock/store/update', {
    method: 'PUT',
    body: {
      update: inventario
        .filter((el) => el.stock_physical != 0)
        .map((el) => ({
          ...el,
          id: el.id ? el.id : null,
        })),
    },
  })
}

export interface IListTemplate {
  id: number
  name: string
  type: string
  measureId: number
  measureName: string
  measureCode: string
  presentationId: number
  presentationName: string
  items: IItemTemplate[]
}

export interface IItemTemplate {
  id: number
  despacho: {
    id: number
    name: string
    categoryId: number | undefined
    categoryName: string | undefined
    measureId: number | undefined
    measureName: string | undefined
    presentationId: number | undefined
    presentationName: string | undefined
  }
  inventario: {
    id: number
    name: string
    categoryId: number | undefined
    categoryName: string | undefined
    measureId: number | undefined
    measureName: string | undefined
    presentationId: number | undefined
    presentationName: string | undefined
  }
}
