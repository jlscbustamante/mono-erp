import { useState } from 'react'

export const useItemLoading = () => {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const start = (id: number) => setLoadingId(id)
  const stop = () => setLoadingId(null)

  const isLoading = (id: number) => loadingId === id

  return {
    loadingId,
    isLoading,
    start,
    stop
  }
}
