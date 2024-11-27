import { useQuery } from '@tanstack/react-query'

import { getSucursalList } from '@/data/products/sdk'

export const useWarehouses = () => {
  const query = useQuery({
    queryKey: ['warehouses-inventory'],
    queryFn: async () => {
      const sucursales = await getSucursalList()
      return sucursales.filter((el) => el.type_sede == 'W')
    },
  })
  return query
}
