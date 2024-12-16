import { CreateEmployeeDrawer } from './create-employee-drawer'
import { EmployeesTable } from './employees-table'
import { NavEmployees } from './nav-employees'

export const EmpleadoPage = () => {
  return (
    <div className="p-3 space-y-3">
      <NavEmployees />
      <EmployeesTable />
      <CreateEmployeeDrawer />
    </div>
  )
}
