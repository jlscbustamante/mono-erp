import { viewClient } from '@/lib/rpc'
import { fCurrency } from '@/utils'
import { RequirementSelect } from '@pizzadb'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Control } from './control'
import { DataTable } from './data-table'
import { ItemReport, useSupplierAccount } from './state'

const getItemReport = (
  requirements: RequirementSelect[],
): Partial<ItemReport>[] => {
  const grouped: Record<string, RequirementSelect[]> = {}
  for (const req of requirements) {
    if (!req.legal_number) continue
    if (!grouped[req.legal_number]) {
      grouped[req.legal_number] = []
    }
    grouped[req.legal_number].push(req)
  }
  const items: Partial<ItemReport>[] = []

  for (const key in grouped) {
    const group = grouped[key]
    const basic: Partial<ItemReport> = {
      key: group[0].legal_number ?? '',
      requestType: 'RUC',
      docNumber: group[0].legal_number ?? '',
      legalName: group[0].legal_name ?? '',
    }
    const listPagos: Partial<ItemReport>[] = group.map((el) => {
      return {
        key: el.id,
        requestType: '',
        requestedAt: el.requested_at ?? '',
        legalName: el.num_document ?? '',
        subTitle: '',
        amount: fCurrency(el.amount ?? 0, false),
        docNumber: '',
      }
    })
    const subTotal = group.reduce((acc, el) => acc + (el.amount ?? 0), 0)
    const summary: Partial<ItemReport> = {
      key: `summary-${group[0].legal_number}`,
      subTitle: 'SUB-TOTAL',
      isSummary: true,
      amount: fCurrency(subTotal, false),
    }

    items.push(basic, ...listPagos, summary)
  }
  return items
}

export function CuentaCorrientePage() {
  const controlRefetch = useSupplierAccount((st) => st.controlRefetch)
  const filters = useSupplierAccount((st) => st.filters)

  const query = useQuery({
    queryKey: ['req:rep-cuenta-corriente', controlRefetch],
    enabled: controlRefetch > 0,
    queryFn: async () => {
      const data =
        await viewClient.api.view.requirement.report.supplier_current_account.$get(
          {
            query: {
              filters: JSON.stringify(filters),
            },
          },
        )
      const body = await data.json()
      return body.data as RequirementSelect[]
    },
  })

  const total = useMemo(() => {
    if (!query.data) return '0.00'
    const total = query.data.reduce((acc, el) => acc + (el.amount ?? 0), 0)
    return fCurrency(total)
  }, [query.data])

  const data: Partial<ItemReport>[] = useMemo(() => {
    if (!query.data) return []
    return getItemReport(query.data)
  }, [query.data])

  return (
    <div className="p-3 space-y-2">
      <Control loading={query.isLoading} />
      <DataTable
        data={[
          ...data,
          {
            isSummary: true,
            key: 'total',
            subTitle: 'TOTAL',
            amount: total,
          },
        ]}
      />
    </div>
  )
}
