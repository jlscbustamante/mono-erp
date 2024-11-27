import { useEffect, useReducer, useState } from 'react'

import * as sdk from '@/data/products/sdk'

export const useDispatchToday = (date: string) => {
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<
    { id: string; title: string; count: number }[]
  >([])
  const [count, refetch] = useReducer((x) => x + 1, 0)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await sdk.getListDispatchToday(date)
      setData(data)
      setLoading(false)
    } catch (err: any) {
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [count])

  return { isLoading: loading, isError, data, refetch }
}
