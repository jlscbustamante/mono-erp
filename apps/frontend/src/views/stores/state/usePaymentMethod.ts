import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { create } from 'zustand'

import { NOTIFICATION } from '@/const/notification'
import * as sdk from '@/data/stores/sdk'
import { IInfoPaymentMethod } from '@/data/stores/types'

type State = {
  date: string
  info: IInfoPaymentMethod[]
  excludeStatus: { title: string; exclude: boolean }[]
  steps: {
    loadStatus: boolean
  }
  drawers: {
    transactionMethod: {
      open: boolean
      sucursalcode: string
      method: string
    }
    infoPos: {
      open: boolean
      sucursalcode: string
      name: string
    }
  }
  loading: {
    getInfo: boolean
    loadEfis: boolean
    infoPos: boolean
    transactionMethod: boolean
    signing: boolean
  }
  //
}
type Action = {
  setDate: (date: string) => void
  setLoading: (loadings: {
    getInfo?: boolean
    loadEfis?: boolean
    infoPos?: boolean
    transactionMethod?: boolean
    signing?: boolean
  }) => void
  setInfo: (info: IInfoPaymentMethod[]) => void
  changeExcluded: (exclude: string[]) => void
  setExcludeStatus: (exclude: { title: string; exclude: boolean }[]) => void
  setSteps: (steps: { loadStatus: boolean }) => void
  setTransactionDrawer: (props: {
    open: boolean
    sucursalcode: string
    method: string
  }) => void
  setInfoPosDrawer: (props: {
    open: boolean
    sucursalcode: string
    name: string
  }) => void
}

export const usePaymentMethodStore = create<State & Action>((set) => ({
  date: dayjs().format('YYYY-MM-DD'),
  info: [],
  steps: {
    loadStatus: false,
  },
  drawers: {
    transactionMethod: {
      open: false,
      sucursalcode: '',
      method: '',
    },
    infoPos: {
      open: false,
      sucursalcode: '',
      name: '',
    },
  },
  excludeStatus: [],
  loading: {
    getInfo: false,
    loadEfis: false,
    infoPos: false,
    transactionMethod: false,
    signing: false,
  },
  setDate: (date) => set({ date }),
  setInfo: (info) => set({ info }),
  setLoading: (loadings) =>
    set((state) => ({
      ...state,
      loading: {
        ...state.loading,
        ...loadings,
      },
    })),
  setTransactionDrawer: (props) =>
    set((state) => ({
      ...state,
      drawers: {
        ...state.drawers,
        transactionMethod: props,
      },
    })),
  setInfoPosDrawer: (props) =>
    set((state) => ({
      ...state,
      drawers: {
        ...state.drawers,
        infoPos: props,
      },
    })),
  changeExcluded: (exclude) => {
    return set((state) => {
      const mantein = state.excludeStatus.map((el) => {
        if (exclude.includes(el.title)) {
          return {
            ...el,
            exclude: true,
          }
        }
        return {
          ...el,
          exclude: false,
        }
      })
      return {
        ...state,
        excludeStatus: [...mantein],
      }
    })
  },
  setExcludeStatus: (exclude) => set({ excludeStatus: exclude }),
  setSteps: (steps: { loadStatus: boolean }) => set({ steps }),
}))

export const usePaymentMethod = () => {
  const store = usePaymentMethodStore()

  const EXCLUDE_STATE_LS = 'excludedStates'

  const onSearch = async () => {
    try {
      store.setLoading({ getInfo: true })
      const data = await sdk.getInfoMethodPayments(
        store.date,
        store.excludeStatus.filter((el) => el.exclude).map((el) => el.title),
      )
      store.setInfo(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ getInfo: false })
    }
  }

  const loadDataFromEfisis = async () => {
    try {
      store.setLoading({ loadEfis: true, getInfo: true })
      toast.info(
        'Cargar todos los datos de todas las tiendas tomara aprox. 1-2 minutos. Espere hasta que termine',
        {
          autoClose: false,
          position: 'bottom-right',
        },
      )
      await sdk.loadFromEfisis(store.date)
      const data = await sdk.getInfoMethodPayments(store.date)
      store.setInfo(data)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ loadEfis: false, getInfo: false })
    }
  }

  const loadStatus = async () => {
    try {
      const allStatus = await sdk.getAllStatusPayment()
      const elements = localStorage.getItem(EXCLUDE_STATE_LS) || '[]'
      const savedElements: string[] = JSON.parse(elements)
      const uniqueElements = new Set([...savedElements, ...allStatus.states])
      const excludedStatus = Array.from(uniqueElements).map((el) => {
        return {
          title: el,
          exclude: savedElements.includes(el),
        }
      })
      store.setExcludeStatus(excludedStatus)
      store.setSteps({ loadStatus: true })
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    }
  }

  const onChangeExclude = (exclude: string[]) => {
    localStorage.setItem(EXCLUDE_STATE_LS, JSON.stringify(exclude))
    store.changeExcluded(exclude)
  }

  const signInfo = async (
    cashId: number,
    sucursalcode: string,
    culqiAmount?: number,
    izipayAmount?: number,
  ) => {
    if (store.loading.signing) return
    try {
      store.setLoading({ signing: true })
      await sdk.firmarMetodoPago(
        cashId,
        store.date,
        sucursalcode,
        culqiAmount,
        izipayAmount,
      )
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      store.setLoading({ signing: false })
    }
  }

  const loadInfoPosBySucursal = async (sucursalcode: string) => {
    try {
      store.setLoading({ infoPos: true })
      const [datainfo, allterminals] = await Promise.all([
        sdk.getAmountByPos(
          sucursalcode,
          store.date,
          store.excludeStatus.filter((el) => el.exclude).map((el) => el.title),
        ),
        sdk.getAllTerminalsBySucursal(sucursalcode),
      ])
      const terminalIdsWithInfo = datainfo.map((el) => el.codigo)
      const infoTerminalsWithoutData = allterminals
        .filter((el) => !terminalIdsWithInfo.includes(el.terminal))
        .map((el) => {
          return {
            amount: '0',
            method: el.supplier?.toLowerCase(),
            codigo: el.terminal,
          }
        })
      const finalArray = [
        ...datainfo.sort((a, b) => {
          if (Number(a.amount) > Number(b.amount)) {
            return -1
          }
          if (Number(a.amount) < Number(b.amount)) {
            return 1
          }
          return 0
        }),
        ...infoTerminalsWithoutData,
      ]
      return finalArray
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    } finally {
      store.setLoading({ infoPos: false })
    }
  }

  const loadTransactionsByMethod = async (
    sucursalcode: string,
    method: string,
  ) => {
    try {
      store.setLoading({ transactionMethod: true })
      const transactions = await sdk.getTransactionsByMethod(
        sucursalcode,
        method,
        store.date,
        store.excludeStatus.filter((el) => el.exclude).map((el) => el.title),
      )
      return transactions
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
      return []
    } finally {
      store.setLoading({ transactionMethod: false })
    }
  }

  return {
    loadTransactionsByMethod,
    signInfo,
    onChangeExclude,
    onSearch,
    loadDataFromEfisis,
    loadStatus,
    loadInfoPosBySucursal,
  }
}
