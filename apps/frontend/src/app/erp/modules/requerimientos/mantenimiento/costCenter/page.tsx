import { Control } from './control'
import { DataTable } from './data-table'
import { CreateCostCenter } from './drawers/create'

export default function CostCenterPage() {
  return (
    <div className="p-3 space-y-3">
      <Control />
      <DataTable />
      <CreateCostCenter />
    </div>
  )
}
