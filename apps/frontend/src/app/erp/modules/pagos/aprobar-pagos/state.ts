import { viewClient } from '@/lib/rpc'
import { WhereOption } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { AdmPaymentOrderSelect, ORDER_PAYMENT_STATUS } from '@types'
import { format, startOfISOWeek } from 'date-fns'
import { create } from 'zustand'

interface IStore {
  filters: WhereOption<AdmPaymentOrderSelect>[]
  set_filters: (filters: WhereOption<AdmPaymentOrderSelect>[]) => void
  refresh_controller: number
  refresh: () => void
}

export const useAprobarPagosStore = create<IStore>((set, get) => ({
  filters: [
    {
      key: 'status',
      field: 'status',
      operator: 'equal',
      value: ORDER_PAYMENT_STATUS.REGISTERED,
    },
    {
      key: 'payment_at',
      field: 'payment_at',
      operator: 'range',
      value: [
        format(startOfISOWeek(new Date()), 'yyyy-MM-dd'),
        format(new Date(), 'yyyy-MM-dd'),
      ],
      useMods: true,
      mods: {
        field: 'DATE',
      },
    },
  ],
  set_filters: (filters) => set({ filters }),
  refresh_controller: 1,
  refresh: () => {
    return set({ refresh_controller: get().refresh_controller + 1 })
  },
}))

export const useAprobarPagosQuery = () => {
  const filters = useAprobarPagosStore((state) => state.filters)
  const refresh_controller = useAprobarPagosStore(
    (state) => state.refresh_controller,
  )
  const query = useQuery({
    queryKey: ['rq:list-aprobar-pagos', refresh_controller],
    enabled: refresh_controller > 0,
    queryFn: async () => {
      const request = await viewClient.api.view.payment.filter_orders.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const response = await request.json()
      if (!request.ok) {
        throw new Error(response.message)
      }
      return response.data as AdmPaymentOrderSelect[]
    },
  })

  return query
}
