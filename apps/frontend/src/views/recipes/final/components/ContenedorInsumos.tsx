import { List, Button, Skeleton } from "antd"
import { useSuppliesQuery } from "@/views/recipes/supplies/hooks/useSuppliesQuery"
import { ISupplies } from "@/views/recipes/shared/types"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"

export const ContenedorInsumos = () => {
  const { data: insumos, isLoading } = useSuppliesQuery()
  const { selected, add, remove } = useRecipeBuilderStore()

  const isSelected = (item: ISupplies) =>
    selected.some(i => i.name === item.name && i.type === "insumo")

  return (
    <div className="space-y-3">
      <Skeleton loading={isLoading} active />

      <List
        header="Insumos disponibles"
        bordered
        dataSource={insumos || []}
        renderItem={(item) => (
          <List.Item
            actions={[
              isSelected(item) ? (
                <Button danger onClick={() => remove(item.name, "insumo")}>
                  Remover
                </Button>
              ) : (
                <Button type="primary" onClick={() => add({ ...item, type: "insumo" })}>
                  Agregar
                </Button>
              )
            ]}
          >
            {item.name} — {item.quantity} {item.unit}
          </List.Item>
        )}
      />
    </div>
  )
}
