import { toast } from 'react-toastify'
import { create } from 'zustand'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/products/sdk'
import {
  IInvBrand,
  IInvPresentation,
  IInvProductItem,
  IInvSupplier,
} from '@/data/products/types'
import { Filters3, OpFilter } from '@/data/types/Filters'

export const useProductItemStore = create<{
  wasUpdateOrCreated: number
  productItems: IInvProductItem[]
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
  filters: Filters3<IInvProductItem>
  brands: IInvBrand[]
  presentations: IInvPresentation[]
  suppliers: IInvSupplier[]
  editProductItemId: number | undefined

  setProducts: (products: IInvProductItem[], total: number) => void
  onChangePagination: (pagination: { page: number; lot: number }) => void
  onLoadingProducts: (loading: boolean) => void
  setFilters: (filters: Filters3<IInvProductItem>) => void
  setDrawers: (drawers: { create?: boolean; edit?: boolean }) => void
  setBrands: (brands: IInvBrand[]) => void
  setPresentations: (measures: IInvPresentation[]) => void
  setSuppliers: (suppliers: IInvSupplier[]) => void
  setEditProductItemId: (editProductItemId: number | undefined) => void
  setWasUpdatedOrCreated: () => void
}>((set) => ({
  wasUpdateOrCreated: 0,
  productItems: [],
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
  brands: [],
  presentations: [],
  suppliers: [],
  editProductItemId: undefined,
  setProducts: (products, total) => {
    return set({ productItems: products, totalProducts: total })
  },
  setFilters: (filters: Filters3<IInvProductItem>) => {
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
  setBrands: (brands) => {
    return set({ brands })
  },
  setPresentations: (presentations) => {
    return set({ presentations })
  },
  setSuppliers: (suppliers) => {
    return set({ suppliers })
  },
  setEditProductItemId: (editProductItemId) => {
    if (editProductItemId == undefined) {
      return set((state) => ({
        ...state,
        drawers: { ...state.drawers, edit: false },
        editProductItemId: undefined,
      }))
    } else {
      return set((state) => ({
        ...state,
        drawers: {
          ...state.drawers,
          edit: true,
        },
        editProductItemId: editProductItemId,
      }))
    }
  },
  setWasUpdatedOrCreated: () => {
    return set((state) => ({
      ...state,
      wasUpdateOrCreated: state.wasUpdateOrCreated + 1,
    }))
  },
}))

export const useProductItem = () => {
  const store = useProductItemStore()

  const loadProducts = async () => {
    try {
      store.onLoadingProducts(true)
      const response = await sdk.productItems({
        select: {
          brand: {
            brand: true,
          },
          presentation: {
            presentation: true,
          },
          supplier: {
            supplier: true,
          },
          measure: {
            id: true,
            measure: true,
            code: true,
          },
        },
        filters: store.filters,
        order: {
          createdAt: 'DESC',
        },
        relations: {
          brand: true,
          presentation: true,
          supplier: true,
          product: {
            category: true,
          },
          measure: true,
        },
      })
      if (
        response.totalPages > 0 &&
        response.totalPages < store.pagination.page
      ) {
        store.onChangePagination({ ...store.pagination, page: 1 })
      } else {
        store.setProducts(response.items, response.count)
      }
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.onLoadingProducts(false)
    }
  }

  const createProduct = async (newProduct: Partial<IInvProductItem>) => {
    try {
      const insertedId = await sdk.createProductItem(newProduct)
      store.setWasUpdatedOrCreated()
      store.setDrawers({ create: false })
      return insertedId.id
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadBrands = async () => {
    try {
      const brands = await sdk.brands()
      store.setBrands(brands)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadPresentations = async () => {
    try {
      const presentations = await sdk.presentations()
      store.setPresentations(presentations)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadSuppliers = async () => {
    try {
      const suppliers = await sdk.suppliers()
      store.setSuppliers(suppliers)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const getListProducts = async () => {
    try {
      const response = await sdk.products({
        select: {
          id: true,
          product: true,
          measureId: true,
        },
        filters: {
          status: [OpFilter.Equal, 1],
        },
      })
      return response.products
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    }
  }

  const editProductItem = async (product: IInvProductItem) => {
    try {
      await sdk.editProductItem(product)
      store.setWasUpdatedOrCreated()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const getOneProductItem = async (id: number) => {
    try {
      const product = await sdk.getOneProductItem(id)
      return product
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  return {
    store,
    createProduct,
    loadProducts,
    loadBrands,
    loadPresentations,
    getListProducts,
    loadSuppliers,
    getOneProductItem,
    editProductItem,
  }
}
