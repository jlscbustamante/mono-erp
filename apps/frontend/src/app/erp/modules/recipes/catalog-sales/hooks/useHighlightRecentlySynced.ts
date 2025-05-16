// catalog-sales/hooks/useHighlightRecentlySynced.ts
import { useState } from 'react'

export const useHighlightRecentlySynced = () => {
  const [highlightedIds, setHighlightedIds] = useState<number[]>([])

  const highlight = (ids: number[]) => {
    setHighlightedIds(ids)
    setTimeout(() => {
      setHighlightedIds([])
    }, 4000)
  }

  const isHighlighted = (id: number) => highlightedIds.includes(id)

  return {
    highlightedIds,
    isHighlighted,
    highlight
  }
}
