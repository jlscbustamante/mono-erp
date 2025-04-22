
import { useState } from "react"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { IItem, medidas } from "../../shared/types"
import { Button, List, Select, Skeleton } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { CrearRecetaBaseDrawer } from "../../base/components/CrearRecetaBaseDrawer"
import { useBaseRecipesQuery } from "../hooks/useBaseRecipesQuery"
import { useProductsQuery } from "../hooks/useProductsQuery"

export const ContenedorRecetaBase = () => {
  const [recetaIdSeleccionada, setRecetaIdSeleccionada] = useState<number | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const {
    selected,
    add,
    remove,
    setRecetaBaseId,
    tamanios,
    factor,
    productoId,
  } = useRecipeBuilderStore()

  const productSizeId = tamanios.find(t => t.factor === factor)?.id

  const { data: recetas = [], isLoading } = useBaseRecipesQuery()

  const recetaSeleccionada = recetas.find(r => r.id === recetaIdSeleccionada) || null

  const isSelected = (item: IItem) =>
    selected.some(i => i.item_id === item.id && i.type === 'base')

  const { data: products = [] } = useProductsQuery()
  const selectedProduct = products.find(p => p.id === productoId)
  const companyId = selectedProduct?.company_id ?? ''


    return (
      <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <Select
          placeholder="Selecciona una receta base"
          className="w-full"
          loading={isLoading}
          onChange={(id: number) => {
            setRecetaIdSeleccionada(id)
            setRecetaBaseId(id)
          }}
          value={recetaIdSeleccionada ?? undefined}
          disabled={!productSizeId}
          options={recetas.map(r => ({ label: r.title, value: r.id }))}
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
        header={`Ingredientes de ${recetaSeleccionada.title}`}
        bordered
        dataSource={recetaSeleccionada.ingredients.map((i) => ({
          ...i,
          name: i.item_name,
        }))}
        renderItem={(item: IItem) => (
          <List.Item
            actions={[
              isSelected(item) ? (
                <Button danger onClick={() => remove(item.id, 'base')}>
                  Remover
                </Button>
              ) : (
                <Button type="primary" onClick={() => add({
                  item_id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  measure_id: item.measure_id,
                  presentation_id: item.presentation_id,
                  type: 'base',
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

      {/* Drawer para crear nueva receta base */}
      <CrearRecetaBaseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        availableSizes={tamanios}
        companyId={companyId}
      />
    </div>
    )
}