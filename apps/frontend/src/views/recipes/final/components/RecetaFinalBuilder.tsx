import { Button, Collapse, Divider, Select } from "antd"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ContenedorRecetaBase } from "./ContenedorRecetaBase"
import { ContenedorRecetaPorSabor } from "./ContenedorRecetaPorSabors"
import { ContenedorInsumos } from "./ContenedorInsumos"
import { VistaPreviaRecetaFinal } from "./VistaPreviaRecetaFinal"
import { useGuardarReceta } from "../hooks/useGuardarReceta"
import { Size } from "../../shared/types"
import { MdSave } from "react-icons/md"

export const RecetaFinalBuilder = () => {
  const { productoId, setProductoId, tamanios, setTamanios, factor, setFactor } = useRecipeBuilderStore()
  const { handleGuardar, isSaving, canSave } = useGuardarReceta()

  // Este llamado se hará a una API real

  const fetchSizesByProduct = async (productId: number): Promise<Size[]> => {
    return [
      { id: 1, name: "Pequeño", factor: 1 },
      { id: 2, name: "Mediano", factor: 1.5 },
      { id: 3, name: "Grande", factor: 2 },
    ]
  }

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Seleccionar producto</label>
        <Select
          placeholder="Seleccionar producto"
          className="w-72"
          options={[
            { label: "Pizza", value: 1 },
            { label: "Lasaña", value: 2 },
          ]}
          onChange={async (id) => {
            setProductoId(id)
            const sizes = await fetchSizesByProduct(id)
            setTamanios(sizes)
            setFactor(1) // Reiniciamos factor
          }}
        />
      </div>

      {productoId && (
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Seleccionar tamaño del producto</label>
          <Select
            className="w-72"
            placeholder="Seleccionar tamaño"
            options={tamanios.map((t) => ({
              label: `${t.name} (x${t.factor})`,
              value: t.factor,
            }))}
            onChange={setFactor}
          />
        </div>
      )}

      <Collapse defaultActiveKey={['base', 'sabor', 'insumos']}>
        <Collapse.Panel header="Receta Base" key="base">
          <ContenedorRecetaBase />
        </Collapse.Panel>
        <Collapse.Panel header="Receta por Sabor" key="sabor">
          <ContenedorRecetaPorSabor />
        </Collapse.Panel>
        <Collapse.Panel header="Insumos" key="insumos">
          <ContenedorInsumos />
        </Collapse.Panel>
      </Collapse>

      <VistaPreviaRecetaFinal />

      <Divider />

      {/* Aquí va un resumen y botón de guardar receta */}
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
  )
}
