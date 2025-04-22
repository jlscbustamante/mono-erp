import { Alert, Button, Table } from "antd"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ColumnsType } from "antd/es/table"
import { ISelectedIngredient } from "../store/useRecipeBuilderStore"

const applyFactor = (ingredient: ISelectedIngredient, factor: number): number => {
  if (ingredient.type === "base" || ingredient.type === "sabor") {
    return Number((ingredient.quantity * factor).toFixed(3))
  }
  return ingredient.quantity
}

export const VistaPreviaRecetaFinal = () => {
  const { selected, factor, clearIngredients } = useRecipeBuilderStore()

  const grouped = {
    base: selected.filter(i => i.type === "base"),
    sabor: selected.filter(i => i.type === "sabor"),
    insumo: selected.filter(i => i.type === "insumo"),
  }

  const resumen = selected.reduce(
    (acc, i) => {
      acc[i.type]++
      return acc
    },
    { base: 0, sabor: 0, insumo: 0 }
  )

  const buildColumns = (): ColumnsType<ISelectedIngredient> => [
    { title: "Ingrediente", dataIndex: "name", key: "name" },
    { title: "Unidad", dataIndex: "unit", key: "unit" },
    {
      title: "Cantidad Final",
      key: "quantityFinal",
      render: (_, item) => <span>{applyFactor(item, factor)}</span>,
    },
  ]

  return (
    <div className="space-y-0">
      {/* Encabezado + resumen */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        {/* <Alert
          message="Resumen de ingredientes"
          description={`Base: ${resumen.base} | Sabor: ${resumen.sabor} | Insumos: ${resumen.insumo}`}
          type="info"
          showIcon
          className="flex-1 min-w-[280px]"
        /> */}
{/* 
        <Button
          type="default"
          danger
          size="middle"
          onClick={clearIngredients}
          disabled={selected.length === 0}
        >
          Limpiar ingredientes
        </Button> */}
      </div>

      {/* Sección: Base */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-700">Ingredientes de Receta Base</h3>
        <Table
          size="small"
          rowKey="item_id"
          columns={buildColumns()}
          dataSource={grouped.base}
          pagination={false}
          bordered
        />
      </div>

      {/* Sección: Sabor */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-700">Ingredientes por Sabor</h3>
        <Table
          size="small"
          rowKey="item_id"
          columns={buildColumns()}
          dataSource={grouped.sabor}
          pagination={false}
          bordered
        />
      </div>

      {/* Sección: Insumos */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-700">Insumos</h3>
        <Table
          size="small"
          rowKey="item_id"
          columns={buildColumns()}
          dataSource={grouped.insumo}
          pagination={false}
          bordered
        />
      </div>
    </div>
  )
}
