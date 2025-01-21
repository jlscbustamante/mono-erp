import { filterSelectForm } from '@/utils'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { IoMdPrint } from 'react-icons/io'
import ReactToPrint from 'react-to-print'
import { useCategories } from '../../hooks/use-categories'
import { DISPATCH_ROUTES } from '../route/routes'

export const DispatchRoutesControl = ({
  date,
  setDate,
  reload,
  loading,
  selectRoute,
  setSelectRoute,
  tableRef,
  categorySelected,
  setCategorySelected,
}: {
  date: string
  setDate: (date: string) => void
  reload: () => void
  loading: boolean
  selectRoute: string | null
  setSelectRoute: (route: string | null) => void
  tableRef: any
  categorySelected: string[]
  setCategorySelected: (categories: string[]) => void
}) => {
  const query = useCategories()
  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex items-center gap-2">
        <DatePicker
          className="w-52"
          value={dayjs(date)}
          allowClear={false}
          onChange={(e) => setDate(e!.format('YYYY-MM-DD'))}
        />
        <Select
          className="w-24"
          placeholder="Ruta"
          showSearch
          value={selectRoute ?? undefined}
          onChange={(val) => {
            setSelectRoute(val)
          }}
          filterOption={filterSelectForm}
        >
          {DISPATCH_ROUTES.map((el) => (
            <Select.Option key={el} value={el}>
              {el}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={reload}
          loading={loading}
          disabled={!selectRoute}
        >
          Cargar despachos
        </Button>
        <Select
          placeholder="Categoría"
          mode="multiple"
          filterOption={filterSelectForm}
          showSearch
          allowClear={true}
          className="w-72"
          value={categorySelected}
          onChange={(val) => setCategorySelected(val)}
          loading={query.isLoading}
        >
          {query.data
            ?.sort((a, b) => a.category?.localeCompare(b.category ?? ''))
            ?.map((el) => (
              <Select.Option key={el.id} value={el.id}>
                {el.category}
              </Select.Option>
            ))}
        </Select>
      </div>
      <ReactToPrint
        content={() => tableRef.current}
        trigger={() => (
          <Button size="small" type="primary" icon={<IoMdPrint />}>
            Imprimir
          </Button>
        )}
      />
    </div>
  )
}
