import { List, Button, Skeleton } from "antd"
import { IItem, medidas } from "@/views/recipes/shared/types"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { useSuppliesQuery } from "../hooks/useSuppliesQuery"

export const ContenedorInsumos = () => {
  const { data: insumos, isLoading } = useSuppliesQuery()
  const { selected, add, remove } = useRecipeBuilderStore()

  const isSelected = (item: IItem) =>
    selected.some(i => i.item_id === item.id && i.type === 'insumo') // o 'sabor', 'insumo'


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
                <Button danger onClick={() => remove(item.id, 'insumo')}>
                  Remover
                </Button>
              ) : (
                <Button type="primary" 
                onClick={() => add({
                  item_id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  measure_id: item.measure_id,
                  presentation_id: item.presentation_id,
                  type: 'insumo'
                })}>
                  Agregar
                </Button>
              )
            ]}
          >
            {item.name} — {item.quantity} {medidas[item.measure_id as keyof typeof medidas] || '??'}
          </List.Item>
        )}
      />
    </div>
  )
}
