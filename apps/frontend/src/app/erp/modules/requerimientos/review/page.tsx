import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { IRequirementDetail, REQUIERMENT_TYPE } from '@view'
import { ReviewForm } from './review-form'
import { ReviewTransferForm } from './review-transfer-form'

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
      return data.data as IRequirementDetail
    },
  })

  return (
    <div className="p-3">
      {!data ? null : data.type == REQUIERMENT_TYPE.TRANSFER ? (
        <ReviewTransferForm data={data} beforeUrl={beforeUrl} />
      ) : (
        <ReviewForm data={data} beforeUrl={beforeUrl} />
      )}
    </div>
  )
}
