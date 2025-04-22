import { Select, List, Button, Skeleton } from "antd"
import { useState } from "react"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { IItem, medidas } from "../../shared/types"
import { IRecipeFlavorIngredient } from "../../shared/types"
import { PlusOutlined } from "@ant-design/icons"
import { CrearSaborDrawer } from "../../flavor/components/CrearSaborDrawer"
import { useFlavorsQuery } from "../hooks/useFlavorsQuery"
import { useProductsQuery } from "../hooks/useProductsQuery"


export const ContenedorRecetaPorSabor = () => {
  const [flavorIdSeleccionado, setFlavorIdSeleccionado] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const {
    selected,
    add,
    remove,
    recetaBaseId,
    setRecipeFlavorId,
    productoId
  } = useRecipeBuilderStore()

  const { data: sabores = [], isLoading } = useFlavorsQuery()

  const recetaSeleccionada = sabores.find(f => f.id === flavorIdSeleccionado) || null

  const isSelected = (item: IRecipeFlavorIngredient) =>
    selected.some(i => i.item_id === item.item_id && i.type === 'sabor')

  const { data: products = [] } = useProductsQuery()
  const selectedProduct = products.find(p => p.id === productoId)
  const companyId = selectedProduct?.company_id ?? ''

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select
          placeholder="Selecciona un sabor"
          className="w-full"
          loading={isLoading}
          onChange={(id) => {
            setFlavorIdSeleccionado(id)
            setRecipeFlavorId(id)
          }}
          disabled={!recetaBaseId}
          value={flavorIdSeleccionado ?? undefined}
          options={sabores.map(s => ({
            label: s.flavor, // ← asegúrate de que `flavor` esté cargado
            value: s.id
          }))}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerOpen(true)}
        />
      </div>

      <Skeleton loading={isLoading} active />

      {recetaSeleccionada && (
        <List
          header={`Ingredientes del sabor seleccionado`}
          bordered
          dataSource={recetaSeleccionada.ingredients.map((i) => ({
            ...i,
            name: i.item_name,
            id: i.item_id,
          }))}
          renderItem={(item) => (
            <List.Item
              actions={[
                isSelected(item) ? (
                  <Button danger onClick={() => remove(item.id, 'sabor')}>
                    Remover
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => add({
                    item_id: item.id,
                    name: item.item_name,
                    quantity: item.quantity,
                    measure_id: item.measure_id,
                    presentation_id: item.presentation_id,
                    type: 'sabor',
                  })}>
                    Agregar
                  </Button>
                )
              ]}
            >
              {item.name} – {item.quantity} {medidas[item.measure_id as keyof typeof medidas] || '??'}
            </List.Item>
          )}
        />
      )}

      {/* Drawer para crear nuevo sabor */}
      <CrearSaborDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        companyId={companyId}
      />
    </div>
  )
}
