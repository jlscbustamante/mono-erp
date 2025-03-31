import { appConfig } from '@/const/config'
import { getToken } from '@/lib/rpc'
import { fCurrency } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import type { IPurchaseReport } from '@types'
import { Excel } from 'antd-table-saveas-excel'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { columns, RowTable } from './columns'
import { Control } from './control'
import { TableReport } from './data_view'
import { use_report_store } from './state'

export default function ReportPurchasePage() {
  const control_refetch = use_report_store((st) => st.control_refetch)
  const dates = use_report_store((st) => st.dates)
  const filters = use_report_store((st) => st.filters)
  const query = useQuery({
    queryKey: ['purchase_report', control_refetch],
    enabled: control_refetch > 0,
    queryFn: async () => {
      const supplier_id = (filters?.supplier_id as any)?.[1] ?? undefined
      const item_id = (filters?.item_id as any)?.[1] ?? undefined
      const category_id = (filters?.category_id as any)?.[1] ?? undefined

      const queryParams = new URLSearchParams({
        start: dates[0],
        end: dates[1],
      })

      if (supplier_id !== undefined) {
        queryParams.append('supplier_id', supplier_id)
      }
      if (item_id !== undefined) {
        queryParams.append('item_id', item_id)
      }
      if (category_id !== undefined) {
        queryParams.append('category_id', category_id)
      }

      const req = await fetch(
        appConfig.clients.view +
          `/api/view/purchase/report?` +
          queryParams.toString(),
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      )
      const data = await req.json()
      return data.data as IPurchaseReport[]
    },
  })

  const datasource: RowTable[] = useMemo(() => {
    const data = query.data ?? []
    const list: RowTable[] = []
    const sorted = data.sort((a, b) => {
      return format(new Date(a.purchase.purchase_at), 'yyyy-MM-dd') >
        format(new Date(b.purchase.purchase_at), 'yyyy-MM-dd')
        ? 1
        : -1
    })
    sorted.forEach((purchase, index) => {
      const have_igv = +purchase.purchase.tax_value > 0
      // const is_last_line = index == purchase.items.length - 1
      purchase.items.forEach((item, i) => {
        const price_exact = +item.total_value / +item.quantity
        let price_with_igv = price_exact
        const is_last_line = i == purchase.items.length - 1
        if (have_igv) {
          price_with_igv = price_exact + price_exact * 0.18
        }
        list.push({
          id: item.id,
          num: i == 0 ? (index + 1).toString() : '',
          // date: purchase.purchase.purchase_at as unknown as string,
          date: new Date(purchase.purchase.purchase_at),
          supplier: purchase.purchase.supplier_name,
          type_doc:
            i == 0
              ? purchase.purchase.num_invoice
                ? 'FACTURA'
                : purchase.purchase.num_guide
                  ? 'GUIA'
                  : ''
              : '',
          num_doc:
            i == 0
              ? (purchase.purchase.num_invoice ??
                purchase.purchase.num_guide ??
                '')
              : '',
          category_name: item.category_name,
          item_name: item.item_name,
          quantity: item.quantity,
          unit_measure: item.unit_measure,
          price: fCurrency(item.unit_value, false).toString(),
          price_with_igv: have_igv ? price_with_igv.toString() : '',
          total: price_with_igv * +item.quantity,
          total_fact: is_last_line
            ? purchase.purchase.total_value.toString()
            : '',
        })
      })
    })
    return list
  }, [query.data])

  const total = useMemo(() => {
    return datasource.reduce((acc, el) => {
      return acc + el.total
    }, 0)
  }, [datasource])

  const handle_export_excel = () => {
    console.log('export : ', datasource.slice(0, 10))
    const name = dates[0] == dates[1] ? dates[0] : `${dates[0]}-${dates[1]}`
    const excel = new Excel()
    excel
      .addSheet('Reporte de compras')
      .addColumns(columns as any)
      .addDataSource(datasource)
      .saveAs(`Reporte de compras ${name}.xlsx`)
  }
  return (
    <div className="p-3 space-y-3">
      <Control
        loading={query.isLoading}
        handle_export_excel={handle_export_excel}
      />
      <TableReport data={datasource} total={total} />
    </div>
  )
}
