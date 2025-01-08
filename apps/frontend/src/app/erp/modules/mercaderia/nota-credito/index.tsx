import { Control } from './control'
import { DataTable } from './data-table'
import { GenerateCreditNote } from './generate-credite-note'

export function NotaCreditoPage() {
  return (
    <div className="p-3">
      <Control />
      <DataTable />
      <GenerateCreditNote />
    </div>
  )
}
