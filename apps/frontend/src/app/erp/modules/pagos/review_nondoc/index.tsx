import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { AdmRequirementSelect } from '@types'
import { useParams } from 'react-router'
import { Control } from './control'

export function ReviewPage() {
  const { id } = useParams()

  const requirement_query = useQuery({
    queryKey: ['rq:get_one', id],
    queryFn: async () => {
      const request = await viewClient.api.view.payment.get_one.$get({
        query: {
          id: Number(id),
        },
      })
      const content = await request.json()
      if (!request.ok) {
        throw new Error(content.message)
      }
      return content.data as AdmRequirementSelect
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
