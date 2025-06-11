import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmReqNondocsSelect } from '@types'
import { DatePicker, Select } from 'antd'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useAnticipoQuery, useAnticipoStore } from './state'

const RangePicker = DatePicker.RangePicker

const options: FilterOption<AdmReqNondocsSelect>[] = []

export default function Control() {
  const filters = useAnticipoStore((state) => state.filters)
  const set_filters = useAnticipoStore((state) => state.set_filters)
  const refresh = useAnticipoStore((state) => state.refresh)
  const { isLoading } = useAnticipoQuery()

  return (
    <div className="flex gap-1 bg-white p-2 rounded-md">
      <CompanySelectForm className="w-48" />
      <RangePicker className="w-72" />
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
        onSearch={() => refresh()}
        filters={filters}
        setFilters={set_filters}
        loading={isLoading}
      />
    </div>
  )
}
