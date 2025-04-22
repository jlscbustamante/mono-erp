import { Drawer, Input, Button, Select, List, message } from 'antd'
import { useState } from 'react'
import { IItem, medidas, Size } from '@/views/recipes/shared/types'
import { useCreateBaseRecipe } from '@/views/recipes/final/hooks/useCreateBaseRecipe'
import { CreateBaseRecipeDto } from '../../shared/dtos/CreateRecipe.dto'
import { useItemsQuery } from '../../final/hooks/useItemsQuery'

interface Props {
  open: boolean
  onClose: () => void
  availableSizes: Size[]
  companyId: string
}

export const CrearRecetaBaseDrawer = ({ open, onClose, availableSizes, companyId }: Props) => {
  const [title, setTitle] = useState('')
  const [sizeId, setSizeId] = useState<number | null>(null)
  const [ingredientes, setIngredientes] = useState<IItem[]>([])
  const { data: items = [], isLoading: loadingItems } = useItemsQuery()

  const { mutate: guardarRecetaBase, isPending } = useCreateBaseRecipe()

  const handleAgregarIngrediente = (item: IItem) => {
    if (ingredientes.some(i => i.id === item.id)) return
    setIngredientes([...ingredientes, item])
  }

  const handleRemoverIngrediente = (itemId: number) => {
    setIngredientes(ingredientes.filter(i => i.id !== itemId))
  }

  const handleGuardar = () => {
    if (!title.trim() || !sizeId || ingredientes.length === 0) {
      return message.warning('Completa todos los campos para crear la receta base')
    }

    const payload: CreateBaseRecipeDto = {
      title: title.trim(),
      product_size_id: sizeId,
      company_id: companyId,
      ingredients: ingredientes.map(i => ({
        item_id: i.id,
        quantity: i.quantity,
        measure_id: i.measure_id,
        presentation_id: i.presentation_id
      }))
    }

    guardarRecetaBase(payload, {
      onSuccess: () => {
        message.success('Receta base creada correctamente')
        setTitle('')
        setSizeId(null)
        setIngredientes([])
        onClose()
      }
    })
  }

  return (
    <Drawer
      title="Crear nueva receta base"
      placement="right"
      open={open}
      onClose={onClose}
      width={600}
    >
      <div className="space-y-4">
        <Input
          placeholder="Nombre de receta base"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          placeholder="Selecciona tamaño"
          className="w-full"
          value={sizeId ?? undefined}
          onChange={setSizeId}
          options={availableSizes.map(t => ({ label: t.name, value: t.id }))}
        />

        <List
          header="Ingredientes disponibles"
          bordered
          loading={loadingItems}
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                ingredientes.some(i => i.id === item.id) ? (
                  <Button danger onClick={() => handleRemoverIngrediente(item.id)}>Quitar</Button>
                ) : (
                  <Button type="primary" onClick={() => handleAgregarIngrediente(item)}>Agregar</Button>
                )
              ]}
            >
              {item.name} — {item.quantity} {medidas[item.measure_id as keyof typeof medidas] ?? ''}
            </List.Item>
          )}
        />


        <List
          header="Ingredientes agregados"
          bordered
          dataSource={ingredientes}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button danger onClick={() => handleRemoverIngrediente(item.id)}>Quitar</Button>
              ]}
            >
              {item.name} - {item.quantity} {medidas[item.measure_id as keyof typeof medidas] ?? ''}
            </List.Item>
          )}
        />

        <Button
          type="primary"
          block
          onClick={handleGuardar}
          loading={isPending}
        >
          Guardar receta base
        </Button>
      </div>
    </Drawer>
  )
}
