import { toast } from 'react-toastify'
import { create } from 'zustand'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import { IInvCategory, IInvMeasure, IInvProduct } from '@/data/products/types'
import { Filters3 } from '@/data/types/Filters'

export const useProductStore = create<{
  controlLoadResources: number
  wasUpdateOrCreated: number
  products: IInvProduct[]
  totalProducts: number
  pagination: {
    page: number
    lot: number
  }
  drawers: {
    create: boolean
    edit: boolean
  }
  loadings: { products: boolean }
  filters: Filters3<IInvProduct>
  categories: IInvCategory[]
  measures: IInvMeasure[]
  editProductId: number | undefined

  setProducts: (products: IInvProduct[], total: number) => void
  onChangePagination: (pagination: { page: number; lot: number }) => void
  onLoadingProducts: (loading: boolean) => void
  setFilters: (filters: Filters3<IInvProduct>) => void
  setDrawers: (drawers: { create?: boolean; edit?: boolean }) => void
  setCategories: (categories: IInvCategory[]) => void
  setMeasures: (measures: IInvMeasure[]) => void
  setEditProductId: (editProductId: number | undefined) => void
  setWasUpdatedOrCreated: () => void
  addControlLoadResources: () => void
}>((set) => ({
  controlLoadResources: 0,
  wasUpdateOrCreated: 0,
  products: [],
  totalProducts: 0,
  pagination: {
    page: 1,
    lot: 15,
  },
  drawers: {
    create: false,
    edit: false,
  },
  loadings: {
    products: false,
  },
  filters: {},
  categories: [],
  measures: [],
  editProductId: undefined,
  setProducts: (products, total) => {
    return set({ products: products, totalProducts: total })
  },
  setFilters: (filters: Filters3<IInvProduct>) => {
    return set({ filters: filters })
  },
  onChangePagination: (pagination) => {
    return set({ pagination: pagination })
  },
  onLoadingProducts: (loading) => {
    return set({ loadings: { products: loading } })
  },
  setDrawers: (drawers) => {
    return set((state) => ({
      ...state,
      drawers: { ...state.drawers, ...drawers },
    }))
  },
  setCategories: (categories) => {
    return set({ categories: categories })
  },
  setMeasures: (measures) => {
    return set({ measures: measures })
  },
  setEditProductId: (editProductId) => {
    if (editProductId === undefined) {
      return set((state) => ({
        ...state,
        drawers: { ...state.drawers, edit: false },
        editProductId: undefined,
      }))
    } else {
      return set((state) => ({
        ...state,
        drawers: {
          ...state.drawers,
          edit: true,
        },
        editProductId: editProductId,
      }))
    }
  },
  setWasUpdatedOrCreated: () => {
    return set((state) => ({
      ...state,
      wasUpdateOrCreated: state.wasUpdateOrCreated + 1,
    }))
  },
  addControlLoadResources: () => {
    return set((state) => ({
      ...state,
      controlLoadResources: state.controlLoadResources + 1,
    }))
  },
}))

export const useProduct = () => {
  const store = useProductStore()

  const loadProducts = async () => {
    try {
      store.onLoadingProducts(true)
      const response = await sdk.products({
        select: {
          measure: {
            code: true,
          },
          category: {
            category: true,
          },
        },
        filters: { ...store.filters },
        relations: {
          category: true,
          measure: true,
        },
        order: {
          createdAt: 'DESC',
        },
      })
      store.setProducts(response.products, response.count)
      store.onChangePagination({
        ...store.pagination,
        page: response.page ?? 1,
      })
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.onLoadingProducts(false)
    }
  }

  const createProduct = async (newProduct: Partial<IInvProduct>) => {
    try {
      await sdk.createProduct(newProduct)
      store.setWasUpdatedOrCreated()
      store.setDrawers({ create: false })
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadMeasures = async () => {
    try {
      const measures = await sdk.measures()
      store.setMeasures(measures)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadCategories = async () => {
    try {
      const categories = await sdk.categories()
      store.setCategories(categories)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const getOneProduct = async (id: number) => {
    try {
      const product = await sdk.getOneProduct(id)
      return product
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const editProduct = async (product: IInvProduct) => {
    try {
      await sdk.editProduct(product)
      store.setWasUpdatedOrCreated()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      store.onLoadingProducts(true)
      await sdk.deleteProduct(id)
      await loadProducts()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return {
    deleteProduct,
    store,
    createProduct,
    loadMeasures,
    loadCategories,
    loadProducts,
    getOneProduct,
    editProduct,
  }
}
