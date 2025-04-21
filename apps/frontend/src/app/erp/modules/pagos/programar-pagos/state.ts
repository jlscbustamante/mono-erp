import { viewClient } from '@/lib/rpc'
import { WhereOption } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import {
  AdmRequirementSelect,
  PAYMENT_STATUS,
  RequirementViewDto,
} from '@types'
import { create } from 'zustand'

interface IStore {
  filters: WhereOption<AdmRequirementSelect>[]
  set_filters: (filters: WhereOption<AdmRequirementSelect>[]) => void
  refresh_controller: number
  refresh: () => void
}

export const useProgramarPagosStore = create<IStore>((set, get) => ({
  filters: [
    {
      key: 'status',
      field: 'status',
      operator: 'in',
      value: [
        PAYMENT_STATUS.APPROVED,
        PAYMENT_STATUS.SCHEDULED,
        PAYMENT_STATUS.SENT_TO_BANK,
      ],
    },
  ],
  set_filters: (filters) => set({ filters }),
  refresh_controller: 1,
  refresh: () => {
    return set({ refresh_controller: get().refresh_controller + 1 })
  },
}))

export const useProgramarPagosQuery = () => {
  const filters = useProgramarPagosStore((state) => state.filters)
  const refresh_controller = useProgramarPagosStore(
    (state) => state.refresh_controller,
  )
  const query = useQuery({
    queryKey: ['rq:list-programar-pagos', refresh_controller],
    enabled: refresh_controller > 0,
    queryFn: async () => {
      const request = await viewClient.api.view.payment.filter.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const response = await request.json()
      if (!request.ok) {
        throw new Error(response.message)
      }
      return response.data as RequirementViewDto[]
    },
  })

  return query
}
