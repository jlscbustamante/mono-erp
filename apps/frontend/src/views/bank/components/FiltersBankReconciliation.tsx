import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSetRecoilState } from 'recoil'

import { FilterAddButton, UserFilters } from '@/components'
import { NOTIFICATION } from '@/const/notification'
import { getFilterTypesForKey, validFieldsForFilter } from '@/data/bank/const'
import * as sdk from '@/data/bank/sdk'
import { bankReconciliationsSt } from '@/data/bank/state'
import { IBankReconciliation } from '@/data/bank/types'
import { Filters } from '@/data/types/Filters'

export const FiltersComponent: React.FC<{
  userFilters: Filters<IBankReconciliation>
  setUserFilters: (filters: Filters<IBankReconciliation>) => void
  baseFilters?: Filters<IBankReconciliation>
  onExport?: () => void
}> = ({ userFilters, setUserFilters, baseFilters, onExport }) => {
  const setBankReconciliation = useSetRecoilState(bankReconciliationsSt)
  const [loading, setLoading] = useState(false)
  const applyFilters = async () => {
    try {
      setLoading(true)
      const bankTransactions = await sdk.filterBankReconciliation({
        ...userFilters,
        ...baseFilters,
      })
      setBankReconciliation(bankTransactions)
    } catch (err: any) {
      toast.error(err.message, NOTIFICATION.error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    onExport?.()
  }

  useEffect(() => {
    applyFilters()
  }, [])
  return (
    <div className="flex gap-2 mb-3 justify-between">
      <div className="flex gap-1">
        <Button type="primary" loading={loading} onClick={applyFilters}>
          Filtrar
        </Button>
        <FilterAddButton
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          items={validFieldsForFilter()}
          getFilterTypesForKey={getFilterTypesForKey}
        />
        <UserFilters
          userFilters={userFilters}
          setFilters={setUserFilters}
          items={validFieldsForFilter()}
          getFilterTypesForKey={getFilterTypesForKey}
          selections={{}}
        />
      </div>
      {onExport && (
        <Button onClick={handleExport} type="text">
          Exportar
        </Button>
      )}
    </div>
  )
}
