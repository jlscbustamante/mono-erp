
import { useEffect, useState } from "react"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { IBaseRecipe, IItem } from "../../shared/types"
import { useBaseRecipesQuery } from "../../base/hooks/useBaseRecipeQuery"
import { Button, List, Select, Skeleton } from "antd"

export const ContenedorRecetaBase = () => {
    const [recetaIdSeleccionada, setRecetaIdSeleccionada] = useState<number | null>(null)
    const { data: recetas, isLoading } = useBaseRecipesQuery()
  
    const recetaSeleccionada = recetas?.find(r => r.id === recetaIdSeleccionada) || null
    const { selected, add, remove, setRecetaBaseId} = useRecipeBuilderStore()
  
    const isSelected = (item: IItem) =>
      selected.some(i => i.name === item.name && i.type === "base")


    return (
      <div className="space-y-3">
        <Select
          placeholder="Selecciona una receta base"
          className="w-full"
          loading={isLoading}
          onChange={(id: number) => {
            setRecetaIdSeleccionada(id)
            setRecetaBaseId(id)
          }}
          options={recetas?.map(r => ({ label: r.dishType, value: r.id })) || []}
        />
  
        <Skeleton loading={isLoading} active />
  
        {recetaSeleccionada && (
          <List
            header={`Ingredientes de ${recetaSeleccionada.dishType}`}
            bordered
            dataSource={recetaSeleccionada.ingredients}
            renderItem={(item) => (
              <List.Item
                actions={[
                  isSelected(item) ? (
                    <Button danger onClick={() => remove(item.name, "base")}>
                      Remover
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => add({ ...item, type: "base" })}>
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