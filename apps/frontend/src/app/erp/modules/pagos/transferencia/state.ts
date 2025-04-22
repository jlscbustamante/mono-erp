import { viewClient } from '@/lib/rpc'
import { WhereOption } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { AdmReqNondocsSelect, AdmReqNondocsViewDto } from '@types'
import { create } from 'zustand'

interface IStore {
  filters: WhereOption<AdmReqNondocsSelect>[]
  set_filters: (filters: WhereOption<AdmReqNondocsSelect>[]) => void
  refresh_controller: number
  refresh: () => void
}

export const useTransferenciaStore = create<IStore>((set, get) => ({
  filters: [
    {
      key: 'request_type',
      field: 'request_type',
      operator: 'equal',
      value: 'T',
    },
  ],
  set_filters: (filters) => set({ filters }),
  refresh_controller: 1,
  refresh: () => {
    return set({ refresh_controller: get().refresh_controller + 1 })
  },
}))

export const useTransferenciasQuery = () => {
  const filters = useTransferenciaStore((state) => state.filters)
  const refresh_controller = useTransferenciaStore(
    (state) => state.refresh_controller,
  )
  const query = useQuery({
    queryKey: ['rq:transferencias', refresh_controller],
    enabled: refresh_controller > 0,
    queryFn: async () => {
      const request = await viewClient.api.view.nondoc.filter.$get({
        query: {
          filters: JSON.stringify(filters),
        },
      })
      const response = await request.json()
      if (!request.ok) {
        throw new Error(response.message)
      }
      return response.data as AdmReqNondocsViewDto[]
    },
  })

  return query
}
