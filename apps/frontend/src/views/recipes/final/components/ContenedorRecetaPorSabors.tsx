import { Select, List, Button, Skeleton } from "antd"
import { useState } from "react"
import { useFlavorRecipesQuery } from "@/views/recipes/flavor/hooks/useFlavorRecipesQuery"
import { IItem } from "@/views/recipes/shared/types"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"

export const ContenedorRecetaPorSabor = () => {
  const [flavorIdSeleccionado, setFlavorIdSeleccionado] = useState<number | null>(null)

  const { selected, add, remove, recetaBaseId, setRecetaBaseId } = useRecipeBuilderStore()

  const { data: sabores = [], isLoading } = useFlavorRecipesQuery(recetaBaseId ?? undefined)
  const recetaSeleccionada = sabores?.find(f => f.id === flavorIdSeleccionado) || null

  const isSelected = (item: IItem) =>
    selected.some(i => i.name === item.name && i.type === "sabor")

  return (
    <div className="space-y-3">
      <Select
        placeholder="Selecciona un sabor"
        className="w-full"
        loading={isLoading}
        onChange={setFlavorIdSeleccionado}
        disabled={!recetaBaseId}
        options={sabores?.map(s => ({ label: s.name, value: s.id })) || []}
      />

      <Skeleton loading={isLoading} active />

      {recetaSeleccionada && (
        <List
          header={`Ingredientes de sabor: ${recetaSeleccionada.name}`}
          bordered
          dataSource={recetaSeleccionada.ingredients}
          renderItem={(item) => (
            <List.Item
              actions={[
                isSelected(item) ? (
                  <Button danger onClick={() => remove(item.name, "sabor")}>
                    Remover
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => add({ ...item, type: "sabor" })}>
                    Agregar
                  </Button>
                )
              ]}
            >
              {item.name} — {item.quantity} {item.unit}
            </List.Item>
          )}
        />
      )}
    </div>
  )
}
