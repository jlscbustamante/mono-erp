import { FilterComponent } from '@/components/fifi'
import { FilterOption } from '@/components/fifi/type'
import { AdmRequirementSelect } from '@types'
import { DatePicker, Select } from 'antd'
import { CompanySelectForm } from '../../requerimientos/components/company-select'
import { useListaEsperaStore, useRequirementsQuery } from './state'

const RangePicker = DatePicker.RangePicker

const options: FilterOption<AdmRequirementSelect>[] = [
  {
    label: 'Id',
    operators: ['equal'],
    key: 'id',
    whereOption: {
      field: 'id',
    },
  },
  {
    label: 'Codigo',
    operators: ['equal'],
    key: 'code',
    whereOption: {
      field: 'request_code',
    },
  },
  {
    label: 'Fecha',
    operators: ['equal'],
    key: 'request_at',
    whereOption: {
      field: 'requested_at',
    },
  },
  {
    label: 'Descripción',
    operators: ['contain', 'equal'],
    key: 'description',
    whereOption: {
      field: 'description',
    },
  },
]

export default function Control() {
  const filters = useListaEsperaStore((state) => state.filters)
  const set_filters = useListaEsperaStore((state) => state.set_filters)
  const refresh = useListaEsperaStore((state) => state.refresh)
  const { isLoading } = useRequirementsQuery()

  const handle_filter = () => {
    refresh()
  }

  return (
    <div className="flex gap-1 bg-white p-2 rounded-md my-1">
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
        onSearch={handle_filter}
        filters={filters}
        setFilters={set_filters}
        loading={isLoading}
      />
    </div>
  )
}
