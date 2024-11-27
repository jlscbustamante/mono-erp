import { getLegalDocs } from '@/data/hex/pos'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useDispatchQuery } from '../state/useDispatch'

export const useDocs = () => {
  const query = useDispatchQuery()

  const docs = useMemo(() => {
    if (!query.data) return []
    const guides = query.data.map((el) => el.numGuide)
    const invoices = query.data.map((el) => el.numInvoice)
    const all = [...guides, ...invoices].filter((el) => el) as string[]
    return all
  }, [query.data])

  const queryDocs = useQuery({
    queryKey: ['getLegalDocs', docs],
    enabled: docs.length > 0,
    queryFn: () => getLegalDocs(docs),
  })

  return queryDocs
}
