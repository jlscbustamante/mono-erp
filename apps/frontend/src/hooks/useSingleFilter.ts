import { useMemo } from 'react'

/**
 * Hook to manage a single filter item
 * @param filters Current filters array
 * @param setFilters Function to update filters
 * @param fieldName Field name to find in filters
 * @param defaultValue Default value to return if filter is not found
 * @param operator Default operator to use when creating a new filter
 */
export function useSingleFilter<T>(
  filters: any[],
  setFilters: (filters: any[]) => void,
  fieldName: string,
  defaultValue: T,
  operator: string = 'equal',
) {
  // Extract the current value from filters
  const value = useMemo(() => {
    const data = filters.find((el) => el.field === fieldName)
    if (!data) return defaultValue
    return data.value as T
  }, [filters, fieldName, defaultValue])

  // Function to update the filter value
  const updateValue = (newValue: T) => {
    if (filters.some((el) => el.field === fieldName)) {
      // Update existing filter
      setFilters(
        filters.map((el) => {
          if (el.field === fieldName) {
            return {
              ...el,
              value: newValue,
            }
          }
          return el
        }),
      )
    } else {
      // Add new filter
      setFilters([
        ...filters,
        {
          key: fieldName,
          field: fieldName,
          operator,
          value: newValue,
        },
      ])
    }
  }

  return [value, updateValue] as const
}
