import { Card, Divider, Table, Typography } from "antd"
import { ISelectedIngredient, useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { ColumnsType } from "antd/es/table"


const { Title } = Typography

const applyFactor = (ingredient: ISelectedIngredient, factor: number): number => {
  if (ingredient.type === "insumo") return ingredient.quantity
  if (ingredient.unit === "kg" || ingredient.unit === "gr") {
    return Number((ingredient.quantity * factor).toFixed(3))
  }
  return ingredient.quantity
}

export const VistaPreviaRecetaFinal = () => {
  const { selected, factor } = useRecipeBuilderStore()

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

  return (
    <div className="space-y-6 mt-6">
      <Title level={4}>Vista previa de receta final</Title>

      <Card title="Ingredientes de Receta Base">
        <Table
          size="small"
          rowKey="name"
          columns={buildColumns()}
          dataSource={grouped.base}
          pagination={false}
        />
      </Card>

      <Card title="Ingredientes por Sabor">
        <Table
          size="small"
          rowKey="name"
          columns={buildColumns()}
          dataSource={grouped.sabor}
          pagination={false}
        />
      </Card>

      <Card title="Insumos">
        <Table
          size="small"
          rowKey="name"
          columns={buildColumns()}
          dataSource={grouped.insumo}
          pagination={false}
        />
      </Card>

      <Divider />
    </div>
  )
}
