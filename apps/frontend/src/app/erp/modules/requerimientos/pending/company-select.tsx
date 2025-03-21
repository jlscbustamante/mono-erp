import { useMemo } from 'react'
import { CompanySelectForm } from '../components/company-select'
import { usePendingStore } from './state'

export const CompanySelectPending = () => {
  const filters = usePendingStore((st) => st.filters)
  const set_filters = usePendingStore((st) => st.setFilters)

  const companyId = useMemo(() => {
    const company = filters.find((el) => el.field === 'company_id')
    return company?.value as string | undefined
  }, [filters])

  const changeCompany = (companyId: string | undefined) => {
    if (companyId) {
      const exist = filters.find((el) => el.field === 'company_id')
      if (exist) {
        set_filters(
          filters.map((el) => {
            if (el.field == 'company_id') {
              return {
                ...el,
                value: companyId,
              }
            }
            return el
          }),
        )
      } else {
        set_filters([
          ...filters,
          {
            field: 'company_id',
            operator: 'equal',
            key: 'company_id',
            value: companyId,
          },
        ])
      }
    } else {
      set_filters(filters.filter((el) => el.field !== 'company_id'))
    }
  }

  return (
    <CompanySelectForm
      value={companyId}
      onChange={changeCompany}
      className="w-40"
    />
  )
}
