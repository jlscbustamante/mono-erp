import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmPaymentOrderSelect } from '@types'
import { DatePicker, Select } from 'antd'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useAprobarPagosQuery, useAprobarPagosStore } from './state'

const RangePicker = DatePicker.RangePicker
const options: FilterOption<AdmPaymentOrderSelect>[] = []

export default function Control() {
  const filters = useAprobarPagosStore((state) => state.filters)
  const set_filters = useAprobarPagosStore((state) => state.set_filters)
  const refresh = useAprobarPagosStore((state) => state.refresh)
  const { isLoading } = useAprobarPagosQuery()

  const handle_filter = () => {
    refresh()
  }

  return (
    <div className="flex gap-1 bg-white p-2 rounded-md">
      <CompanySelectForm className="w-48" />
      <RangePicker className="w-72" />
      <Select
        className="w-48"
        placeholder="Tipo"
        allowClear={true}
        defaultValue={'T'}
      >
        <Select.Option value="S">Simple</Select.Option>
        <Select.Option value="T">Transferencia</Select.Option>
      </Select>
      <Select
        className="w-48"
        placeholder="Estado"
        allowClear={true}
        defaultValue={'T'}
      >
        <Select.Option value="S">Pendiente</Select.Option>
        <Select.Option value="T">Aprobados</Select.Option>
      </Select>
      <FilterComponent
        options={options}
        filters={filters}
        setFilters={set_filters}
        onSearch={handle_filter}
        loading={isLoading}
      />
    </div>
  )
}
