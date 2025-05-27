import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { AdmReqNondocsViewDto } from '@types'
import { useParams } from 'react-router'
import { Control } from './control'

export function ReviewNonDocPage() {
  const { id } = useParams()

  const requirement_query = useQuery({
    queryKey: ['rq:non_doc:get_one', id],
    enabled: !!id,
    queryFn: async () => {
      const request = await viewClient.api.view.nondoc.get_one.$get({
        query: {
          id: id!,
        },
      })
      const content = await request.json()
      if (!request.ok) {
        throw new Error(content.message)
      }
      return content.data as AdmReqNondocsViewDto
    },
  })

  return (
    <div className="bg-blue-50 min-h-screen">
      {requirement_query.data && (
        <Control requirement={requirement_query.data} />
      )}
    </div>
  )
}
