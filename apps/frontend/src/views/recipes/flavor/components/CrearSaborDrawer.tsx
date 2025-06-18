import { useCreateFlavorWithIngredients } from '@/views/recipes/final/hooks/useCreateFlavorWithIngredients'
import { useItemsQuery } from '@/views/recipes/final/hooks/useItemsQuery'
import { IItem, medidas } from '@/views/recipes/shared/types'
import { Button, Drawer, Input, List, message } from 'antd'
import { useState } from 'react'
import { CreateFlavorWithIngredientsDto } from '../../shared/dtos/CreateRecipe.dto'

interface Props {
  open: boolean
  onClose: () => void
  companyId: string
}

export const CrearSaborDrawer = ({ open, onClose, companyId }: Props) => {
  const [flavorName, setFlavorName] = useState('')
  const [ingredientes, setIngredientes] = useState<IItem[]>([])
  const { data: items = [], isLoading } = useItemsQuery()
  const { mutate: guardarSabor, isPending } = useCreateFlavorWithIngredients()

  const handleAgregar = (item: IItem) => {
    if (ingredientes.some((i) => i.id === item.id)) return
    setIngredientes([...ingredientes, item])
  }

  const handleRemover = (id: number) => {
    setIngredientes(ingredientes.filter((i) => i.id !== id))
  }

  const handleGuardar = () => {
    if (!flavorName.trim() || ingredientes.length === 0) {
      return message.warning(
        'Debe ingresar un nombre y seleccionar ingredientes',
      )
    }

    const payload: CreateFlavorWithIngredientsDto = {
      flavor: {
        flavor: flavorName.trim(),
        menuflav_id: 1001, // dummy por ahora
        company_id: companyId,
      },
      ingredients: ingredientes.map((i) => ({
        item_id: i.id,
        quantity: i.quantity,
        measure_id: i.measure_id,
        presentation_id: i.presentation_id,
      })),
    }

    guardarSabor(payload, {
      onSuccess: () => {
        setFlavorName('')
        setIngredientes([])
        onClose()
      },
    })
  }

  return (
    <Drawer
      title="Crear nuevo sabor"
      placement="right"
      open={open}
      onClose={onClose}
      width={650}
    >
      <div className="space-y-4">
        <Input
          placeholder="Nombre del sabor"
          value={flavorName}
          onChange={(e) => setFlavorName(e.target.value)}
        />

        <List
          header="Ingredientes disponibles"
          bordered
          loading={isLoading}
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                ingredientes.some((i) => i.id === item.id) ? (
                  <Button danger onClick={() => handleRemover(item.id)}>
                    Quitar
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => handleAgregar(item)}>
                    Agregar
                  </Button>
                ),
              ]}
            >
              {item.name} — {item.quantity}{' '}
              {medidas[item.measure_id as keyof typeof medidas] ?? ''}
            </List.Item>
          )}
        />

        <List
          header="Ingredientes seleccionados"
          bordered
          dataSource={ingredientes}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key={item.id}
                  danger
                  onClick={() => handleRemover(item.id)}
                >
                  Quitar
                </Button>,
              ]}
            >
              {item.name} — {item.quantity}{' '}
              {medidas[item.measure_id as keyof typeof medidas] ?? ''}
            </List.Item>
          )}
        />

        <Button
          type="primary"
          block
          loading={isPending}
          onClick={handleGuardar}
        >
          Guardar sabor
        </Button>
      </div>
    </Drawer>
  )
}
