import { toast } from 'react-toastify'
import { create } from 'zustand'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { IInvPurchase } from '@/data/products/types/purchase'
import { Filters3, OpFilter } from '@/data/types/Filters'
import dayjs from 'dayjs'

export const usePurchaseStore = create<{
  controlLoadResources: number
  controlLoadPurchase: number
  purchases: IInvPurchase[]
  infoPurchaseId: number | undefined
  totalPurchases: number
  filters: Filters3<IInvPurchase>
  drawers: {
    create: boolean
    info: boolean
  }
  loadings: {
    purchases: boolean
  }
  pagination: {
    page: number
    lot: number
  }
  order: {
    field: string
    order: 'asc' | 'desc' | undefined
  }
  setOrder: (field: string, order: 'asc' | 'desc' | undefined) => void
  setPurchases: (purchases: IInvPurchase[], count: number) => void
  setPagination: (pagination: { page: number; lot: number }) => void
  setLoadings: (loadings: { purchases?: boolean }) => void
  setFilters: (filters: Filters3<IInvPurchase>) => void
  addControlLoadPurchase: () => void
  setDrawers: (drawers: { create?: boolean; info?: boolean }) => void
  setInfoDrawer: (id: number | undefined) => void
  addControlLoadResources: () => void
}>((set) => ({
  order: {
    field: 'id',
    order: 'desc',
  },
  setOrder: (field, order) => {
    return set({ order: { field: field, order: order } })
  },

  controlLoadResources: 0,
  controlLoadPurchase: 0,
  drawers: {
    create: false,
    info: false,
  },
  totalPurchases: 0,
  purchases: [],
  filters: {
    purchaseAt: [OpFilter.EqualDate, dayjs().format('YYYY-MM-DD')],
  },
  loadings: {
    purchases: false,
  },
  pagination: {
    page: 1,
    lot: 15,
  },
  infoPurchaseId: undefined,
  setPurchases: (purchases, count) => {
    return set({ purchases: purchases, totalPurchases: count })
  },
  setPagination: (pagination) => {
    return set({ pagination: pagination })
  },
  setFilters: (filters) => {
    return set({ filters: filters })
  },
  setLoadings: (loadings) => {
    return set((state) => ({
      ...state,
      loadings: { ...state.loadings, ...loadings },
    }))
  },
  addControlLoadPurchase: () => {
    return set((state) => ({
      ...state,
      controlLoadPurchase: state.controlLoadPurchase + 1,
    }))
  },
  setDrawers: (drawers) => {
    return set((state) => ({
      ...state,
      drawers: { ...state.drawers, ...drawers },
    }))
  },
  setInfoDrawer: (id) => {
    if (id)
      return set((state) => ({
        ...state,
        infoPurchaseId: id,
        drawers: {
          ...state.drawers,
          info: true,
        },
      }))
    else
      return set((state) => ({
        ...state,
        infoPurchaseId: undefined,
        drawers: { ...state.drawers, info: false },
      }))
  },
  addControlLoadResources: () => {
    return set((state) => ({
      ...state,
      controlLoadResources: state.controlLoadResources + 1,
    }))
  },
}))

export const usePurchase = () => {
  const store = usePurchaseStore()

  const loadPurchases = async () => {
    try {
      store.setLoadings({ purchases: true })
      const response = await sdk.purchases({
        filters: store.filters,
        order: {
          createdAt: 'DESC',
        },
      })
      if (
        response.totalPages > 0 &&
        response.totalPages < store.pagination.page
      ) {
        store.setPagination({ ...store.pagination, page: 1 })
      } else store.setPurchases(response.purchases, response.count)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoadings({ purchases: false })
    }
  }

  const getOnePurchase = async (purchaseId: number) => {
    try {
      const purchase = await sdk.purchases({
        filters: { id: [OpFilter.Equal, purchaseId] },
        relations: { items: true },
      })
      if (purchase.purchases[0]) return purchase.purchases[0]
      else return undefined
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const getListProductItems = async () => {
    try {
      const response = await sdk.productItems({
        select: {
          // id: true,
          // productId: true,
          // itemName: true,
          // brandId: true,
          // presentationId: true,
          // unitPrice: true,
          // status: true,
          brand: {
            brand: true,
          },
          presentation: {
            presentation: true,
          },
          product: {
            id: true,
            measure: {
              id: true,
              code: true,
            },
          },
        },
        relations: {
          brand: true,
          presentation: true,
          product: {
            measure: true,
          },
        },
        order: {
          itemName: 'ASC',
        },
      })
      return response.items
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    }
  }

  const getItemsDispatchInTemplate = async () => {
    try {
      const response = await sdk.itemsInTemplate()
      return response
    } catch (err: any) {
      console.error(err)
      return []
    }
  }

  const createPurchase = async (purchase: IInvPurchase) => {
    try {
      await sdk.createPurchase(purchase)
      store.addControlLoadPurchase()
      return true
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return {
    store,
    loadPurchases,
    getOnePurchase,
    getListProductItems,
    createPurchase,
    getItemsDispatchInTemplate,
  }
}
