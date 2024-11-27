import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { create } from 'zustand'

import { NOTIFICATION } from '@/const/notification'
import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import * as sdk from '@/data/products/sdk'
import {
  DispatchStatus,
  DispatchType,
  IDispatch,
  IDispatchItem,
  IInvWarehouse,
} from '@/data/products/types'
import { Filters3, OpFilter } from '@/data/types/Filters'

export const useDispatchStore = create<{
  controlUpdateOrCreated: number
  dispatches: IDispatch[]
  showValueForm: string | undefined
  setShowValueForm: (value: string | undefined) => void
  filters: Filters3<IDispatch>
  dispatchIdInfo: number | undefined
  totalCount: number
  pagination: {
    page: number
    lot: number
  }
  loading: {
    loading: boolean
    warehouses: boolean
    create: boolean
    info: boolean
    approving: boolean
    updating: boolean
  }
  drawers: { create: boolean; info: boolean; edit: boolean }
  warehouses: IInvWarehouse[]
  setFilters: (filters: Filters3<IDispatch>) => void
  addControlUpdateOrCreated: () => void
  setPagination: (pagination: { page: number; lot: number }) => void
  setDrawers: (drawers: {
    create?: boolean
    info?: boolean
    edit?: boolean
  }) => void
  setWarehouses: (warehouses: IInvWarehouse[]) => void
  setLoading: (loading: {
    warehouses?: boolean
    create?: boolean
    loading?: boolean
    info?: boolean
    approving?: boolean
    updating?: boolean
  }) => void
  setData: (response: {
    dispatches: IDispatch[]
    count: number
    totalPage: number
  }) => void
  openInfoDrawer: (dispatchId: number) => void
  closeInfoDrawer: () => void
}>((set) => ({
  controlUpdateOrCreated: 0,
  dispatchIdInfo: undefined,
  dispatches: [],
  showValueForm: undefined,
  setShowValueForm: (value) => {
    return set({ showValueForm: value })
  },
  totalCount: 0,
  loading: {
    loading: false,
    warehouses: false,
    create: false,
    info: false,
    approving: false,
    updating: false,
  },
  pagination: {
    page: 1,
    lot: 15,
  },
  warehouses: [],
  filters: {
    moveAt: [OpFilter.EqualDate, format(new Date(), 'yyyy-MM-dd')],
  },
  drawers: {
    create: false,
    info: false,
    edit: false,
  },
  controlLoadPurchase: 0,
  setFilters: (filters) => {
    return set({ filters: filters })
  },
  openInfoDrawer: (dispatchId) => {
    return set((state) => ({
      ...state,
      dispatchIdInfo: dispatchId,
      drawers: {
        ...state.drawers,
        info: true,
      },
    }))
  },
  closeInfoDrawer: () => {
    return set((state) => ({
      ...state,
      dispatchIdInfo: undefined,
      drawers: {
        ...state.drawers,
        info: false,
      },
    }))
  },
  setLoading: (loading) => {
    return set((state) => ({
      ...state,
      loading: { ...state.loading, ...loading },
    }))
  },
  setPagination: (pagination) => {
    return set({ pagination: pagination })
  },
  addControlUpdateOrCreated: () => {
    return set((state) => ({
      controlUpdateOrCreated: state.controlUpdateOrCreated + 1,
    }))
  },
  setWarehouses: (warehouses) => {
    return set({ warehouses: warehouses })
  },
  setDrawers: (drawers) => {
    return set((state) => ({
      ...state,
      drawers: { ...state.drawers, ...drawers },
    }))
  },
  setData: (response) => {
    return set({
      dispatches: response.dispatches,
      totalCount: response.count ?? 0,
    })
  },
}))

export const useDispatchBetweenStoresStore = create<{
  controlUpdateOrCreated: number
  dispatches: IDispatch[]
  filters: Filters3<IDispatch>
  dispatchIdInfo: number | undefined
  totalCount: number
  pagination: {
    page: number
    lot: number
  }
  loading: {
    loading: boolean
    warehouses: boolean
    create: boolean
    info: boolean
    approving: boolean
    updating: boolean
  }
  drawers: { create: boolean; info: boolean; edit: boolean }
  warehouses: IInvWarehouse[]
  setFilters: (filters: Filters3<IDispatch>) => void
  addControlUpdateOrCreated: () => void
  setPagination: (pagination: { page: number; lot: number }) => void
  setDrawers: (drawers: {
    create?: boolean
    info?: boolean
    edit?: boolean
  }) => void
  setWarehouses: (warehouses: IInvWarehouse[]) => void
  setLoading: (loading: {
    warehouses?: boolean
    create?: boolean
    loading?: boolean
    info?: boolean
    approving?: boolean
    updating?: boolean
  }) => void
  setData: (response: {
    dispatches: IDispatch[]
    count: number
    totalPage: number
  }) => void
  openInfoDrawer: (dispatchId: number) => void
  closeInfoDrawer: () => void
}>((set) => ({
  controlUpdateOrCreated: 0,
  dispatchIdInfo: undefined,
  dispatches: [],
  totalCount: 0,
  loading: {
    loading: false,
    warehouses: false,
    create: false,
    info: false,
    approving: false,
    updating: false,
  },
  pagination: {
    page: 1,
    lot: 15,
  },
  warehouses: [],
  filters: {
    moveAt: [OpFilter.EqualDate, format(new Date(), 'yyyy-MM-dd')],
  },
  drawers: {
    create: false,
    info: false,
    edit: false,
  },
  controlLoadPurchase: 0,
  setFilters: (filters) => {
    return set({ filters: filters })
  },
  openInfoDrawer: (dispatchId) => {
    return set((state) => ({
      ...state,
      dispatchIdInfo: dispatchId,
      drawers: {
        ...state.drawers,
        info: true,
      },
    }))
  },
  closeInfoDrawer: () => {
    return set((state) => ({
      ...state,
      dispatchIdInfo: undefined,
      drawers: {
        ...state.drawers,
        info: false,
      },
    }))
  },
  setLoading: (loading) => {
    return set((state) => ({
      ...state,
      loading: { ...state.loading, ...loading },
    }))
  },
  setPagination: (pagination) => {
    return set({ pagination: pagination })
  },
  addControlUpdateOrCreated: () => {
    return set((state) => ({
      controlUpdateOrCreated: state.controlUpdateOrCreated + 1,
    }))
  },
  setWarehouses: (warehouses) => {
    return set({ warehouses: warehouses })
  },
  setDrawers: (drawers) => {
    return set((state) => ({
      ...state,
      drawers: { ...state.drawers, ...drawers },
    }))
  },
  setData: (response) => {
    return set({
      dispatches: response.dispatches,
      totalCount: response.count ?? 0,
    })
  },
}))

export const useDispatch = () => {
  const store = useDispatchStore((state) => state)

  const loadDispatches = async () => {
    try {
      store.setLoading({ loading: true })
      const {
        dispatches,
        count,
        totalPages: totalPage,
        page,
      } = await sdk.filterDispatch({
        select: { wareFrom: { name: true }, wareTo: { name: true } },
        filters: store.filters,
        order: {
          createdAt: 'DESC',
        },
        relations: { wareFrom: true, wareTo: true },
      })
      store.setData({
        dispatches,
        count,
        totalPage: totalPage ?? 1,
      })
      store.setPagination({ ...store.pagination, page: page ?? 1 })
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ loading: false })
    }
  }

  const getOneDispatch = async (id: number) => {
    try {
      store.setLoading({ info: true })
      const dispatch = await sdk.filterDispatch({
        filters: { id: [OpFilter.Equal, id] },
        relations: {
          wareFrom: true,
          wareTo: true,
          items: {
            item: {
              product: true,
              presentation: true,
            },
          },
        },
      })
      return dispatch.dispatches[0] ?? undefined
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ info: false })
    }
  }

  const getSucursals = async (): Promise<
    { label: string; value: string }[]
  > => {
    try {
      const sus = await sdk.getSucursalList()
      const selectList = sus.map((el: ISucursal) => ({
        label: el.title,
        value: el.id,
      }))
      return selectList
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    }
  }

  const createWarehouse = async (warehouse: Partial<IInvWarehouse>) => {
    try {
      await sdk.createWarehouse(warehouse)
      await loadWarehouses()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const loadWarehouses = async () => {
    store.setLoading({ warehouses: true })
    const data = await sdk.warehouseFilter({})
    store.setWarehouses(data.warehouses)
    store.setLoading({ warehouses: false })
  }

  const createDispatch = async (
    dispatch: Partial<IDispatch>,
    items: (Partial<IDispatchItem> & {
      key: number
      _brandName?: string | undefined
      _presentationName?: string | undefined
      _measureCode?: string | undefined
    })[],
  ) => {
    try {
      store.setLoading({ create: true })
      const cleanedItems = items.map((item) => {
        return {
          ...item,
          _brandName: undefined,
          _presentationName: undefined,
          _measureCode: undefined,
          key: undefined,
        }
      }) as IDispatchItem[]
      const finalObj: Partial<IDispatch> = {
        ...dispatch,
        items: cleanedItems,
      }
      await sdk.createDispatch(finalObj)
      await loadDispatches()
      return true
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ create: false })
    }
  }

  const loadFilterTemplate = async (filters: Filters3<IDispatch>) => {
    try {
      const { dispatches } = await sdk.filterDispatch({
        select: {
          items: {
            id: true,
            productId: true,
            itemId: true,
            itemName: true,
            brandId: true,
            presentationId: true,
            unitValue: true,
            quantity: true,
            presentation: {
              presentation: true,
            },
            brand: {
              brand: true,
            },
            item: {
              id: true,
              product: {
                id: true,
                measure: {
                  id: true,
                  measure: true,
                  code: true,
                },
              },
            },
          },
        },
        filters,
        pagination: { lot: 12, page: 1 },
        order: {
          createdAt: 'DESC',
        },
        relations: {
          wareFrom: true,
          wareTo: true,
          items: {
            presentation: true,
            brand: true,
            item: {
              product: {
                measure: true,
              },
            },
          },
        },
      })
      return dispatches
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    }
  }

  const approveDispatch = async (id: number, cb: () => void) => {
    try {
      store.setLoading({ approving: true })
      await sdk.approveDispatch(id)
      cb()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ approving: false })
    }
  }

  const updateDispatch = async (
    dispatch: Partial<IDispatch>,
    cb: () => void,
  ) => {
    try {
      const dsp = Object.assign({}, dispatch)
      delete dsp.wareFrom
      delete dsp.wareTo
      store.setLoading({ updating: true })
      await sdk.updateDispatch({
        ...dsp,
        status: DispatchStatus.APPROVED,
      })
      cb()
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ updating: false })
    }
  }

  return {
    updateDispatch,
    approveDispatch,
    loadFilterTemplate,
    store,
    getSucursals,
    createWarehouse,
    loadWarehouses,
    createDispatch,
    loadDispatches,
    getOneDispatch,
  }
}

const loadDispatchesVariation = async (filters: Filters3<IDispatch>) => {
  const { dispatches } = await sdk.filterDispatch({
    select: { wareFrom: { name: true }, wareTo: { name: true } },
    filters,
    order: {
      // createdAt: 'DESC',
      wareTo: {
        name: 'ASC',
      },
    },
    relations: { wareFrom: true, wareTo: true },
  })
  return dispatches
}

export const useDispatchQuery = () => {
  const filters = useDispatchStore((state) => state.filters)
  const controler = useDispatchStore((state) => state.controlUpdateOrCreated)

  const query = useQuery({
    queryKey: ['load-dispatches', controler],
    queryFn: () =>
      loadDispatchesVariation({
        ...filters,
        moveType: [
          OpFilter.In,
          DispatchType.WarehouseToStore,
          DispatchType.Exceptional,
        ],
      }),
    refetchOnWindowFocus: true,
  })

  return query
}

export const useDispatchBetweenStoresQuery = () => {
  const filters = useDispatchBetweenStoresStore((state) => state.filters)
  const controler = useDispatchBetweenStoresStore(
    (state) => state.controlUpdateOrCreated,
  )

  const query = useQuery({
    queryKey: ['load-dispatches', controler],
    queryFn: () =>
      loadDispatchesVariation({
        ...filters,
        moveType: [OpFilter.Equal, DispatchType.BetweenStores],
      }),
    refetchOnWindowFocus: true,
  })

  return query
}
