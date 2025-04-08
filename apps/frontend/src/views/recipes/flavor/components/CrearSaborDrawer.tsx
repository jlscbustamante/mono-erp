import { Drawer, Form, Input, Button, List, Skeleton, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useSuppliesQuery } from "@/views/recipes/supplies/hooks/useSuppliesQuery"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useRecipeBuilderStore } from "../../final/store/useRecipeBuilderStore"
import { IItem, medidas } from "../../shared/types"
import { createFlavorRecipe } from "../../shared/services/recipeBaseApi"

interface Props {
  open: boolean
  onClose: () => void
}

export const CrearSaborDrawer = ({ open, onClose }: Props) => {
  const [form] = Form.useForm()
  const { data: insumos = [], isLoading } = useSuppliesQuery()
  const [ingredientes, setIngredientes] = useState<IItem[]>([])
  const queryClient = useQueryClient()
  const { recetaBaseId } = useRecipeBuilderStore()

  const mutation = useMutation({
    mutationFn: createFlavorRecipe,
    onSuccess: () => {
      message.success("Sabor creado correctamente")
      queryClient.invalidateQueries({ queryKey: ['flavor-recipes', recetaBaseId] })
      onClose()
      form.resetFields()
      setIngredientes([])
    },
    onError: (err: any) => {
      message.error(`Error al crear sabor: ${err.message}`)
    }
  })

  const addIngrediente = (item: IItem) => {
    if (ingredientes.some(i => i.id === item.id)) return
    setIngredientes(prev => [...prev, item])
  }

  const removeIngrediente = (id: number) => {
    setIngredientes(prev => prev.filter(i => i.id !== id))
  }

  const handleFinish = (values: any) => {
    const payload = {
      flavor: values.flavor,
      base_id: recetaBaseId!,
      ingredients: ingredientes.map(i => ({
        item_id: i.id,
        quantity: i.quantity,
        measure_id: i.measure_id,
        presentation_id: i.presentation_id
      }))
    }
    mutation.mutate(payload)
  }

  return (
    <Drawer
      title="Crear sabor"
      width={600}
      open={open}
      onClose={onClose}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="flavor"
          label="Nombre del sabor"
          rules={[{ required: true, message: "Ingrese el nombre del sabor" }]}
        >
          <Input placeholder="Ej: Napolitano" />
        </Form.Item>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Agregar ingredientes</h3>
          <Skeleton loading={isLoading} active />
          <List
            bordered
            dataSource={insumos}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="add" type="primary" onClick={() => addIngrediente(item)}>
                    Agregar
                  </Button>
                ]}
              >
                {item.name} — {item.quantity} {medidas[item.measure_id as keyof typeof medidas]}
              </List.Item>
            )}
          />
        </div>

        {ingredientes.length > 0 && (
          <div className="mt-4">
            <h4>Ingredientes seleccionados</h4>
            <List
              bordered
              dataSource={ingredientes}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="remove" danger onClick={() => removeIngrediente(item.id)}>
                      Quitar
                    </Button>
                  ]}
                >
                  {item.name} – {item.quantity} {medidas[item.measure_id as keyof typeof medidas]}
                </List.Item>
              )}
            />
          </div>
        )}

        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isPending}
            icon={<PlusOutlined />}
          >
            Crear sabor
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
