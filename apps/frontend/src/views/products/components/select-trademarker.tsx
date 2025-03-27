import { viewClient } from '@/lib/rpc'
import { useQuery } from '@tanstack/react-query'
import { Select } from 'antd'

export const SelectTradeMarker = ({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) => {
  const query = useQuery({
    queryKey: ['trademark'],
    queryFn: async () => {
      const request = await viewClient.api.view.company.$get()
      const data = await request.json()
      return data.data as { id: string; title: string }[]
    },
  })

  return (
    <Select
      className="w-52"
      placeholder="Compañia"
      allowClear={true}
      value={value}
      onChange={onChange}
    >
      {query.data?.map((item) => {
        return (
          <Select.Option value={item.id} key={item.id}>
            {item.title}
          </Select.Option>
        )
      })}
    </Select>
  )
}
