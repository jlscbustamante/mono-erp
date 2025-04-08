import { Alert, Button, Card, Divider, Table, Typography } from "antd"
import { ISelectedIngredient, useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ColumnsType } from "antd/es/table"


const { Title } = Typography

const applyFactor = (ingredient: ISelectedIngredient, factor: number): number => {
  if (ingredient.type === "insumo") return ingredient.quantity
  return Number((ingredient.quantity * factor).toFixed(3))
}

export const VistaPreviaRecetaFinal = () => {
  const { selected, factor, clearIngredients } = useRecipeBuilderStore()

  const grouped = {
    base: selected.filter(i => i.type === "base"),
    sabor: selected.filter(i => i.type === "sabor"),
    insumo: selected.filter(i => i.type === "insumo"),
  }

  const buildColumns = (): ColumnsType<ISelectedIngredient> => [
    { title: "Ingrediente", dataIndex: "name", key: "name" },
    { title: "Unidad", dataIndex: "unit", key: "unit" },
    {
      title: "Cantidad Final",
      key: "quantityFinal",
      render: (_, item) => <span>{applyFactor(item, factor)}</span>,
    },
  ]

  const resumen = selected.reduce(
    (acc, i) => {
      acc[i.type]++
      return acc
    },
    { base: 0, sabor: 0, insumo: 0 }
  )

  return (
    <div className="space-y-6 mt-6">
    <Title level={4}>Vista previa de receta final</Title>
  
    <div className="flex justify-between items-start gap-4">
      <Alert
        message="Resumen de ingredientes"
        description={`Base: ${resumen.base} | Sabor: ${resumen.sabor} | Insumos: ${resumen.insumo}`}
        type="info"
        showIcon
        className="flex-1"
      />
  
      <Button
        type="default"
        danger
        size="middle"
        onClick={clearIngredients}
        disabled={selected.length === 0}
      >
        Limpiar ingredientes
      </Button>
    </div>
  
    <Card title="Ingredientes de Receta Base">
      <Table
        size="small"
        rowKey="item_id"
        columns={buildColumns()}
        dataSource={grouped.base}
        pagination={false}
      />
    </Card>
  
    <Card title="Ingredientes por Sabor">
      <Table
        size="small"
        rowKey="item_id"
        columns={buildColumns()}
        dataSource={grouped.sabor}
        pagination={false}
      />
    </Card>
  
    <Card title="Insumos">
      <Table
        size="small"
        rowKey="item_id"
        columns={buildColumns()}
        dataSource={grouped.insumo}
        pagination={false}
      />
    </Card>
  
    <Divider />
  </div>
  )
}
