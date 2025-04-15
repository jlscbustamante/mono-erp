import { FilterComponent } from '@/components/fifi'
import { DatePicker, Select } from 'antd'
import { CompanySelectForm } from '../../requerimientos/components/company-select'

const RangePicker = DatePicker.RangePicker

export default function Control() {
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
      <FilterComponent />
    </div>
  )
}
