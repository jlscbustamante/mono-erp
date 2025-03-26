import { viewClient } from '@/lib/rpc'
import { RequirementSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { IRequirementDetail } from '@view'
import { Review } from './review'

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

  const query = useQuery({
    queryKey: ['rq:requirement-raw', id],
    enabled: !!id,
    queryFn: async () => {
      const result = await viewClient.api.view.requirement.requirement.raw[
        ':id'
      ].$get({
        param: {
          id: id!.toString(),
        },
      })

      const data = await result.json()
      return data.data as RequirementSelect | null
    },
  })

  return (
    <div className="p-3 bg-blue-50 min-h-full">
      {query.data && <Review data={query.data} />}
      {/* {!data ? null : data.type == REQUIERMENT_TYPE.TRANSFER ? (
        <ReviewTransferForm data={data} beforeUrl={beforeUrl} />
      ) : (
        <ReviewForm data={data} beforeUrl={beforeUrl} />
      )} */}
    </div>
  )
}
