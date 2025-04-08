import { useMutation } from "@tanstack/react-query"
import { useRecipeBuilderStore } from "../store/useRecipeBuilderStore"
import { createFinalRecipe } from "@/data/Recipe/sdk"
import { message, Modal } from "antd"
import { buildFinalRecipePayload } from "../utils/buildFinalRecipePayload"

export const useGuardarReceta = () => {
    const {
      selected,
      factor,
      recetaBaseId,
      productoId,
      recipeFlavorId,
      tamanios,
      reset,
    } = useRecipeBuilderStore()
  
    const mutation = useMutation({
      mutationFn: createFinalRecipe,
      onSuccess: () => {
        message.success("Receta guardada correctamente")
        reset()
      },
      onError: (err: any) => {
        message.error(`Error al guardar receta: ${err.message}`)
      },
    })
  

    const canSave =
    productoId !== null &&
    recetaBaseId !== null &&
    selected.some(i => i.type !== 'insumo') &&
    tamanios.some(t => t.factor === factor)


    const handleGuardar = () => {
      const hasIngredientes = selected.some(i => i.type !== 'insumo')

      if (!hasIngredientes) {
        return message.warning("Debe agregar al menos un ingrediente base o de sabor")
      }

      const recetaFinal = buildFinalRecipePayload({
        product_id: productoId!,
        product_size_id: tamanios.find(t => t.factor === factor)?.id || 0,
        recipe_base_id: recetaBaseId!,
        recipe_flavor_id: recipeFlavorId,
        factor,
        selected,
      })
  
      Modal.confirm({
        title: "¿Guardar receta final?",
        content: "Esta acción guardará la receta con los ingredientes y cantidades seleccionadas.",
        onOk: () => mutation.mutate(recetaFinal),
      })
    }
  
    return { handleGuardar, isSaving: mutation.isPending, canSave }
  }