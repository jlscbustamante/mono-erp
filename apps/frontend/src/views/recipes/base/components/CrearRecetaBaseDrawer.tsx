import { Button, Drawer, Form, Input, List, message, Select, Skeleton } from "antd"
import { IItem, medidas, Size } from "../../shared/types"
import { createBaseRecipe } from "../../shared/services/recipeBaseApi"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSuppliesQuery } from "../../supplies/hooks/useSuppliesQuery"
import { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"

interface Props {
    open: boolean
    onClose: () => void
    availableSizes: Size[]
  }
  

export const CrearRecetaBaseDrawer = ({ open, onClose, availableSizes }: Props) => {
    const [form] = Form.useForm()
    const { data: insumos = [], isLoading } = useSuppliesQuery()
    const [ingredientes, setIngredientes] = useState<IItem[]>([])
    const queryClient = useQueryClient()
  
    const mutation = useMutation({
      mutationFn: createBaseRecipe,
      onSuccess: () => {
        message.success("Receta base creada correctamente")
        queryClient.invalidateQueries({ queryKey: ['base-recipes'] })
        onClose()
        form.resetFields()
        setIngredientes([])
      },
      onError: (err: any) => {
        message.error(`Error al crear receta: ${err.message}`)
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
        title: values.title,
        product_size_ids: values.product_size_ids,
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
        title="Crear Receta Base"
        width={600}
        open={open}
        onClose={onClose}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="title"
            label="Nombre de la receta base"
            rules={[{ required: true, message: "Ingrese el nombre de la receta" }]}
          >
            <Input placeholder="Ej: Base Clásica" />
          </Form.Item>
  
          <Form.Item
            name="product_size_ids"
            label="Tamaños disponibles"
            rules={[{ required: true, message: "Seleccione al menos un tamaño" }]}
          >
            <Select
              mode="multiple"
              options={availableSizes.map(size => ({
                label: `${size.name} (x${size.factor})`,
                value: size.id
              }))}
              placeholder="Seleccionar tamaños"
            />
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
              Crear receta base
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    )
  }