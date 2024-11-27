import { filterSelectForm } from '@/utils'
import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import { IoMdPrint } from 'react-icons/io'
import ReactToPrint from 'react-to-print'
import { useCategories } from '../../hooks/use-categories'

const RangePicker = DatePicker.RangePicker

export const ConsolidatedControls = ({
  dates,
  setDates,
  reload,
  isLoading,
  tableRef,
  categorySelected,
  setCategorySelected,
}: {
  dates: string[]
  setDates: (dates: string[]) => void
  reload: () => void
  isLoading?: boolean
  tableRef: any
  categorySelected: string[]
  setCategorySelected: (categories: string[]) => void
}) => {
  const query = useCategories()
  return (
    <div className="flex gap-2 justify-between items-center">
      <div className="flex items-center gap-2">
        <RangePicker
          allowClear={false}
          value={[dayjs(dates[0]), dayjs(dates[1])]}
          onChange={(val) => {
            if (!val) return
            const newDates = val.map((el) => el?.format('YYYY-MM-DD') || '')
            setDates(newDates)
          }}
        />
        <Button type="primary" loading={isLoading} onClick={reload}>
          Cargar consolidado
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
          <Button size="small" icon={<IoMdPrint />}>
            Imprimir
          </Button>
        )}
      />
    </div>
  )
}
