import { Collapse, Divider, Select } from "antd"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ContenedorRecetaBase } from "./ContenedorRecetaBase"
import { ContenedorRecetaPorSabor } from "./ContenedorRecetaPorSabors"
import { ContenedorInsumos } from "./ContenedorInsumos"
import { VistaPreviaRecetaFinal } from "./VistaPreviaRecetaFinal"

export const RecetaFinalBuilder = () => {
    const {factor, setFactor} = useRecipeBuilderStore()

      // Este llamado se hará a una API real
  const sizes = [
    { id: 1, name: 'Pequeña', factor: 1 },
    { id: 2, name: 'Mediana', factor: 1.5 },
    { id: 3, name: 'Familiar', factor: 2 },
  ]

  return (
    <div className="bg-white shadow rounded p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Seleccionar tamaño del producto</label>
        <Select
          className="w-72"
          placeholder="Seleccionar tamaño"
          options={sizes.map((size) => ({
            label: `${size.name} (x${size.factor})`,
            value: size.factor,
          }))}
          onChange={(value) => setFactor(value)}
        />
      </div>

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
    </div>
  )
}
