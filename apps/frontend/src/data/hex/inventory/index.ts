import { baseUrl } from '@/data/api/baseUrl'

import config from '@/config'
import { ITEM } from '@/const/localStorageItems'
import { IInvProductItem } from '@/data/products/types'
import { format } from 'date-fns'
import {
  CreateDriverDto,
  Dispatch,
  DispatchCreateDto,
  DispatchItem,
  DispatchItemAddDto,
  DispatchRoute,
  DispatchSummary,
  DispatchTransport,
  DispatchUpdateDto,
  Driver,
  Item,
  MoveBetweenStoresDto,
  StockGeneral,
  StockItemToCreateDto,
  UpdateDriverDto,
  Warehouse,
  WarehouseLegal,
  WarehouseRoute,
} from '../types'

export const getStockByRange = (
  warehouse: string,
  args: { start: string; end: string },
) => {
  if (!warehouse) return
  return baseUrl<{
    stock: StockGeneral[]
    lastClosed: string | null
  }>('hex/inventory/stockByRange', {
    method: 'GET',
    query: {
      warehouse,
      ...args,
    },
  })
}

export const getLastClosed = (warehouse: string) => {
  return baseUrl<string | null>('hex/inventory/lastClosedDate', {
    method: 'GET',
    query: {
      warehouse,
    },
  })
}

export const approveDispatch = (dispatch: DispatchUpdateDto) => {
  return baseUrl('hex/inventory/approveDispatch', {
    method: 'POST',
    body: dispatch,
  })
}

export const approveDispatchWithoutValidate = (dispatch: DispatchUpdateDto) => {
  return baseUrl('hex/inventory/approveDispatchWV', {
    method: 'POST',
    body: dispatch,
  })
}

export const createAndApproveDispatch = (dispatch: DispatchCreateDto) => {
  return baseUrl('hex/inventory/createDispatchAndApprove', {
    method: 'POST',
    body: dispatch,
  })
}

export const createDispatchException = (dispatch: DispatchCreateDto) => {
  return baseUrl('hex/inventory/createDispatchException', {
    method: 'POST',
    body: dispatch,
  })
}

export const storePurchase = async (purchaseId: number) => {
  if (!purchaseId) return
  return baseUrl('hex/inventory/storePurchase', {
    method: 'POST',
    body: { id: purchaseId },
  })
}
export const revertStorePurchase = async (purchaseId: number) => {
  if (!purchaseId) return
  return baseUrl('hex/inventory/revertStorePurchase', {
    method: 'POST',
    body: { id: purchaseId },
  })
}

export const getWarehouses = async () => {
  return baseUrl<Warehouse[]>('hex/inventory/warehouses')
}

export const lastClosedDate = async (warehouseCode: string) => {
  return baseUrl<{ date: string | null }>('hex/inventory/lastClosedWarehouse', {
    query: { warehouseCode },
  })
}

export const getEditTemplate = async (warehouseCode: string, date: string) => {
  return baseUrl<StockItemToCreateDto[]>('hex/inventory/editTemplate', {
    query: { warehouse: warehouseCode, date },
  })
}

export const saveStock = async (args: {
  stock: StockItemToCreateDto[]
  date: string
  warehouse: string
}) => {
  return baseUrl<void>('hex/inventory/saveStock', {
    body: args,
    method: 'POST',
  })
}

/**
 * @description Retorna informacion acerca de los cierres de almacen, si todo esta bien returna [] vacio
 */
export const getInfoWarehousesToday = () => {
  return baseUrl<{ code: string; message: string }[]>(
    'hex/inventory/info/warehouses',
  )
}

export const checkTemplates = () => {
  return baseUrl<{
    store: string[]
    warehouse: string[]
    global: string[]
  }>('hex/inventory/checkTemplates')
}

export const approveMovement = (movement: MoveBetweenStoresDto) => {
  return baseUrl('hex/inventory/approveMovement', {
    method: 'POST',
    body: movement,
  })
}

export const getDispatchDetail = (id: number) => {
  return baseUrl<Dispatch>(`hex/inventory/dispatch/${id}`)
}

export const getItems = () => {
  return baseUrl<Item[]>('hex/inventory/items')
}

export const updateDispatch = (dispatch: DispatchUpdateDto) => {
  return baseUrl<void>('hex/inventory/dispatch/update', {
    method: 'PUT',
    body: dispatch,
  })
}

export const generateInvoice = async (id: number) => {
  return baseUrl<void>('hex/inventory/dispatch/invoice', {
    method: 'POST',
    body: {
      dispatchId: id,
    },
  })
}

export const generateInvoiceAndGuide = async (data: {
  id: number
  transport: DispatchTransport | null
}) => {
  return baseUrl<void>('hex/inventory/dispatch/invoiceAndGuide', {
    method: 'POST',
    body: {
      dispatchId: data.id,
      transport: data.transport ?? null,
    },
  })
}

export const generateGuide = async (id: number) => {
  return baseUrl<void>('hex/inventory/dispatch/guide', {
    method: 'POST',
    body: {
      dispatchId: id,
    },
  })
}

type DataGuideWithTransport = { dispatchId: number } & DispatchTransport
export const generateGuideWithTransportista = async (
  data: DataGuideWithTransport,
) => {
  return baseUrl<void>('hex/inventory/dispatch/guideWithTransport', {
    method: 'POST',
    body: data,
  })
}

export const getActiveDrivers = async () => {
  return baseUrl<Driver[]>('hex/inventory/drivers')
}

export const simpleDispatch = async (
  id: number,
  date: string,
  warehouseOrigin: string | undefined,
) => {
  console.log('call api : ', id)
  return baseUrl<void>('hex/inventory/dispatch/simple-dispatch', {
    method: 'POST',
    body: {
      dispatchDate: date,
      dispatchId: id,
      wareFromId: warehouseOrigin,
    },
  })
}

export const getLegalWarehouses = async () => {
  return baseUrl<WarehouseLegal[]>('hex/inventory/warehouseLegal')
}

export const createLegalWarehouse = async (warehouse: WarehouseLegal) => {
  return baseUrl<void>('hex/inventory/warehouseLegal', {
    method: 'POST',
    body: warehouse,
  })
}

export const updateLegalWarehouse = async (warehouse: WarehouseLegal) => {
  return baseUrl<void>('hex/inventory/warehouseLegal', {
    method: 'PUT',
    body: warehouse,
  })
}

export const createDriver = async (driver: CreateDriverDto) => {
  return baseUrl<void>('hex/inventory/driver', {
    method: 'POST',
    body: driver,
  })
}

export const updateDriver = async (driver: UpdateDriverDto) => {
  return baseUrl<void>('hex/inventory/driver', {
    method: 'PUT',
    body: driver,
  })
}

export const deleteDriver = async (driverId: number) => {
  return baseUrl<void>(`hex/inventory/driver/${driverId}`, {
    method: 'DELETE',
  })
}

export const drivers = async () => {
  return baseUrl<Driver[]>('hex/inventory/driver')
}

export const getWarehouseRoute = async (): Promise<WarehouseRoute[]> => {
  return baseUrl<WarehouseRoute[]>('hex/inventory/warehouse/route')
}

export const updateWarehouseRoute = async (data: {
  route: string
  warehouseIds: string[]
}): Promise<void> => {
  return baseUrl<void>('hex/inventory/warehouse/route', {
    method: 'PUT',
    body: data,
  })
}

export const getDispatchesRoute = async (
  date: string,
  route: string,
): Promise<DispatchRoute[]> => {
  return baseUrl<DispatchRoute[]>('hex/inventory/dispatchByRoute', {
    query: { date, route },
  })
}

export const getDispatchesSummary = async (dates: {
  start: string
  end: string
}) => {
  return baseUrl<{ dispatches: DispatchSummary[]; dates: [string, string] }>(
    `hex/inventory/disapatchConsolidation`,
    {
      query: dates,
    },
  )
}

export const modifyDispatched = async (data: {
  dispatchId: number
  toCreate: DispatchItemAddDto[]
  toUpdate: DispatchItem[]
  toDelete: DispatchItem[]
  taxValue: number
}) => {
  return baseUrl<void>('hex/inventory/dispatch/updateDispatched', {
    method: 'PUT',
    body: data,
  })
}

export const zipedFiles = async (
  docs: {
    doc_url: string
    doc_operacion: string
    warehouseId: string
  }[],
) => {
  const token = localStorage.getItem(ITEM.TOKEN)
  const response = await fetch(
    `${config.API}/hex/inventory/dispatch/zipedFiles`,
    {
      method: 'POST',
      body: JSON.stringify({
        files: docs,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
  if (!response.ok) {
    throw new Error('Error al tratar de obtener los archivos')
  }
  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = format(new Date(), 'yyyy-MM-dd')
  a.download = `archivos-${date}.zip` // Nombre del archivo a descargar
  document.body.appendChild(a)
  a.click()

  // Limpiar el objeto URL
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const defaultWarehouse = async () => {
  return baseUrl<string | null>('hex/inventory/defaultWarehouse')
}

export const divideDispatch = async (data: {
  dispatchId: number
  relation: {
    dispatchItemId: number
    warehouseId: string
  }[]
}) => {
  return baseUrl('hex/inventory/divideDispatch', {
    method: 'POST',
    body: data,
  })
}

export const getConsolidateByItem = (itemId: number, date: string) => {
  return baseUrl<
    { storeCode: string; storeName: string; quantity: number; total: number }[]
  >('hex/dispatch/consolidate-item', {
    query: {
      date: date,
      itemId: itemId,
    },
  })
}

export const resetDispatch = async (dispatchId: number) => {
  return baseUrl<void>('hex/dispatch/reset', {
    method: 'PUT',
    body: {
      id: dispatchId,
    },
  })
}

export const resetAndDeleteDispatch = async (dispatchId: number) => {
  return baseUrl<void>('hex/dispatch/reset-and-delete', {
    method: 'PUT',
    body: {
      id: dispatchId,
    },
  })
}

export const getPrincipalProducts = async () => {
  return baseUrl<IInvProductItem[]>('hex/inventory/items-pricipales')
}

export const getRelationsProducts = async (itemId: number) => {
  return baseUrl<IInvProductItem[]>('hex/inventory/items-relations', {
    query: {
      itemId: itemId,
    },
  })
}

export const updatePriceItem = async (data: {
  itemId: number
  cost: number
  price: number
}) => {
  return baseUrl('hex/inventory/item/price', {
    method: 'PUT',
    body: {
      itemId: data.itemId,
      cost: data.cost,
      price: data.price,
    },
  })
}

export const updateSucursalFromPos = async (storeCode: string) => {
  return baseUrl<void>('pos/store/update-store', {
    method: 'PUT',
    body: {
      storeCode,
    },
  })
}
