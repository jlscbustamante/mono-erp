import { FilterComponent } from '@/components/fifi'
import { Button, DatePicker } from 'antd'
import { CompanySelectForm } from '../../components/company-select'
import { SupplierSelectForm } from '../../components/supplier-select'

const RangePicker = DatePicker.RangePicker

export const Control = () => {
  return (
    <div className="flex items-center gap-2">
      <RangePicker />
      <CompanySelectForm />
      <SupplierSelectForm />
      <FilterComponent hideActions={true} />
      <Button type="primary">Consultar</Button>
    </div>
  )
}
