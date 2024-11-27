import { useQuery } from '@tanstack/react-query'

import { getInfoWarehousesToday } from '@/data/hex/inventory'

export const WarehouseAlert = () => {
  const query = useQuery({
    queryKey: ['warehouse-alert-info'],
    queryFn: getInfoWarehousesToday,
  })

  if (query.data?.length == 0 || !query.isFetched) return null

  return (
    <div className="w-full bg-red-300 px-3 py-2 rounded-md mb-2 text-sm ">
      <ul className="list-none">
        {query.data?.map((warehouse) => (
          <li key={warehouse.code}>
            {warehouse.message}.{' '}
            <a
              className="underline"
              target="_blank"
              href={`/products/warehouse/stock?warehouse=${warehouse.code}`}
              rel="noreferrer"
            >
              Cerrar aquí
            </a>
            {'; '}
            de lo contrario, no se podrá despachar.
          </li>
        ))}
      </ul>
    </div>
  )
}
