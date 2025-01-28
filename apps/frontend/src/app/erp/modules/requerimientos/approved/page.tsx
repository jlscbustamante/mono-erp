import { Control } from './control'
import { DataTable } from './data-table'
import { NavRequest } from './nav'

export function ApprovedPage() {
  return (
    <div className="p-3">
      <Control />
      <NavRequest />
      <DataTable />
    </div>
  )
}
