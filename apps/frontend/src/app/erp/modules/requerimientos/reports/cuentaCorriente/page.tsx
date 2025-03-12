import { Control } from './control'
import { DataTable } from './data-table'

export function CuentaCorrientePage() {
  // const controlRefetch = useSupplierAccount((st) => st.controlRefetch)
  // const filters = useSupplierAccount((st) => st.filters)

  // const _query = useQuery({
  //   queryKey: ['req:rep-cuenta-corriente', controlRefetch],
  //   queryFn: async () => {
  //     const data =
  //       await viewClient.api.view.requirement.report.supplier_current_account.$get(
  //         {
  //           query: {
  //             filters: JSON.stringify(filters),
  //           },
  //         },
  //       )
  //     const body = await data.json()
  //     console.log('sec : ', body.data)
  //     return body.data
  //   },
  // })

  return (
    <div className="p-3 space-y-2">
      <Control />
      <DataTable />
    </div>
  )
}
