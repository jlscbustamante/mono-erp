import { getDispatchesSummary } from '@/data/hex/inventory'
import { useQuery } from '@tanstack/react-query'

export const useDispatchConsolidated = ({
  start,
  end,
  control,
}: {
  start: string
  end: string
  control: number
}) => {
  const query = useQuery({
    queryKey: ['dispatches-consolidated', control],
    enabled: control > 0,
    queryFn: () => {
      return getDispatchesSummary({ start, end })
    },
  })

  return query
}
