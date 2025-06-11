import { RequestsFilters } from './FilterControl'
export const ProductoFinal = () => {
  const applyFilters = () => {}

  const cleanFilters = () => {}
  return (
    <>
      <div className="flex">
        <span className="p-5">Recetas de producto final</span>
        <span>&nbsp;</span>
        <RequestsFilters
          applyFilters={applyFilters}
          cleanFilters={cleanFilters}
        />
      </div>
    </>
  )
}
