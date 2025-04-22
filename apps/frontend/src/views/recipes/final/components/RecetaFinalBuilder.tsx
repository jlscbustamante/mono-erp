import { Button, Input, Select } from "antd"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ContenedorRecetaBase } from "./ContenedorRecetaBase"
import { ContenedorRecetaPorSabor } from "./ContenedorRecetaPorSabors"
import { ContenedorInsumos } from "./ContenedorInsumos"
import { VistaPreviaRecetaFinal } from "./VistaPreviaRecetaFinal"
import { useGuardarReceta } from "../hooks/useGuardarReceta"
import { MdSave, MdDeleteOutline } from "react-icons/md"
import { useProductsQuery } from "../hooks/useProductsQuery"
import { useSizesQuery } from "../hooks/useSizesQuery"

export const RecetaFinalBuilder = () => {
  const {
    productoId,
    setProductoId,
    tamanios,
    setTamanios,
    factor,
    setFactor,
    clearIngredients,
    selected,
    recipeGroup,
    setRecipeGroup,
  } = useRecipeBuilderStore()

  const { handleGuardar, isSaving, canSave } = useGuardarReceta()
  const { data: products = [] } = useProductsQuery()
  const { data: sizes = [] } = useSizesQuery()

  return (
    <div className="relative w-full">
      {/* Layout principal: contenido + sidebar */}
      <div className="flex gap-6 items-start flex-wrap lg:flex-nowrap pb-24">
        {/* Vista previa sin scroll vertical */}
        <div className="flex-1 min-w-[320px] max-w-full overflow-hidden">
          <VistaPreviaRecetaFinal />
        </div>

        {/* Sidebar lateral derecha */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 sticky top-4 max-h-[calc(100vh-80px)] overflow-y-auto pb-4">

          {/* Campo: Nombre de receta final */}
          <div className="space-y-2">
            <label className="font-semibold">Nombre de receta final</label>
            <Input
              placeholder="Ej. Pizza Familiar Clásica"
              value={recipeGroup}
              onChange={(e) => setRecipeGroup(e.target.value)}
              maxLength={10}
              showCount
            />
          </div>

          {/* Selector de producto */}
          <div className="space-y-2">
            <label className="font-semibold">Seleccionar producto</label>
            <Select
              placeholder="Seleccionar producto"
              className="w-full"
              options={products.map(p => ({ label: p.product, value: p.id }))}
              onChange={(id) => {
                setProductoId(id)
                setTamanios(sizes)
                setFactor(1)
              }}
              value={productoId ?? undefined}
            />
          </div>

          {/* Selector de tamaño */}
          {productoId && (
            <div className="space-y-2">
              <label className="font-semibold">Seleccionar tamaño del producto</label>
              <Select
                className="w-full"
                placeholder="Seleccionar tamaño"
                options={tamanios.map((t) => ({
                  label: `${t.name} (x${t.factor})`,
                  value: t.factor,
                }))}
                onChange={setFactor}
                value={factor}
              />
            </div>
          )}

          {/* Resumen de ingredientes */}
          {selected.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
              <h3 className="font-semibold mb-1">Resumen de ingredientes</h3>
              <ul className="list-disc pl-5">
                {['base', 'sabor', 'insumo'].map((type) => {
                  const count = selected.filter(i => i.type === type).length
                  return (
                    <li key={type}>
                      {type[0].toUpperCase() + type.slice(1)}: {count}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Contenedores */}
          <ContenedorRecetaBase />
          <ContenedorRecetaPorSabor />
          <ContenedorInsumos />
        </div>
      </div>

      {/* Botones sticky abajo */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 px-6 py-4 flex justify-between items-center">
        <Button
          icon={<MdDeleteOutline />}
          danger
          onClick={clearIngredients}
          disabled={selected.length === 0}
        >
          Limpiar ingredientes
        </Button>

        <Button
          type="primary"
          icon={<MdSave className="text-lg" />}
          loading={isSaving}
          onClick={handleGuardar}
          disabled={!canSave}
        >
          Guardar receta final
        </Button>
      </div>
    </div>
  )
}
