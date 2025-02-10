import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { RequirementDetail } from '@view'
import { ReviewForm } from './review-form'

export function RequirementReview() {
  const searchParams = new URLSearchParams(window.location.search)
  const id = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const beforeUrl = searchParams.get('bf') ? searchParams.get('bf') : null
  const { data } = useQuery({
    queryKey: ['rq:requirement', id],
    enabled: !!id,
    queryFn: async () => {
      const result = await viewClient.api.view.requirement.requirement[
        ':id'
      ].$get({
        param: {
          id: id!.toString(),
        },
      })

      const data = await result.json()
      return data.data as RequirementDetail
    },
  })
  return (
    <div className="p-3">
      {data && <ReviewForm data={data} beforeUrl={beforeUrl} />}
    </div>
  )
}
