import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'

export const TestPage = () => {
  const query = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const req = await viewClient.api.view.payment.nothing.$get()
      const res = await req.json()
      return res.data
    },
  })
  return (
    <div>
      <div>
        <p>Pagina de prueba</p>
      </div>
      <div>===</div>
      <div>{JSON.stringify(query.data)}</div>
      <div>===</div>
    </div>
  )
}
