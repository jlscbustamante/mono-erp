import { ExcelExportBtn } from '@/components/excel-btn'
import {
  AddFilterButton,
  FilterOPtions,
} from '@/components/filter/AddFilterButton'
import { ShowFilters } from '@/components/filter/ShowFilters'
import { OpFilter } from '@/data/types/Filters'
import { useCategories } from '@/views/products/hooks/use-categories'
import { useItems } from '@/views/products/hooks/use-items'
import { useSupplierQuery } from '@/views/products/provider/useSupplierQuery'
import { Button, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { use_report_store } from './state'

const options = [
  {
    label: 'Categoria',
    options: [OpFilter.Select],
    key: 'category_id',
  },
  {
    key: 'supplier_id',
    label: 'Proveedor',
    options: [OpFilter.Select],
  },
  {
    key: 'item_id',
    label: 'Item',
    options: [OpFilter.Select],
  },
] satisfies FilterOPtions[]

export const Control = ({
  loading,
  handle_export_excel,
}: {
  loading: boolean
  handle_export_excel: () => void
}) => {
  const dates = use_report_store((st) => st.dates)
  const set_dates = use_report_store((st) => st.set_dates)
  const refetch = use_report_store((st) => st.refetch)
  const filters = use_report_store((st) => st.filters)
  const set_filters = use_report_store((st) => st.set_filters)

  const query_supplier = useSupplierQuery()
  const query_categories = useCategories()
  const query_items = useItems()

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 flex-1">
        <DatePicker.RangePicker
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(val) => {
            if (val && val[0] && val[1]) {
              const start = val[0].format('YYYY-MM-DD')
              const end = val[1].format('YYYY-MM-DD')
              set_dates(start, end)
            }
          }}
        />
        <AddFilterButton
          items={options}
          setUserFilters={set_filters}
          userFilters={filters}
        />
        <ShowFilters
          rootClass="flex items-center gap-1"
          options={options}
          userFilters={filters}
          setUserFilters={set_filters}
          selections={{
            supplier_id:
              query_supplier.data?.map((el) => ({
                label: el.supplier,
                value: el.id,
              })) ?? [],
            category_id:
              query_categories.data?.map((el) => ({
                label: el.category,
                value: el.id,
              })) ?? [],
            item_id:
              query_items.data?.map((el) => ({
                label: el.name,
                value: el.id,
              })) ?? [],
          }}
        />
        <Button type="primary" onClick={() => refetch()} loading={loading}>
          Cargar reporte
        </Button>
      </div>
      <ExcelExportBtn onExport={handle_export_excel} />
    </div>
  )
}
