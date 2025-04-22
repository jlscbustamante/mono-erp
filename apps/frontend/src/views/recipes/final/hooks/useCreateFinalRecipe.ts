import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { IFinalRecipePayload } from '@/views/recipes/shared/types'
import { createFinalRecipe } from '../services/recipeFinalService'

export const useCreateFinalRecipe = () => {
  return useMutation({
    mutationFn: createFinalRecipe,
    onSuccess: () => {
      message.success('Receta final guardada con éxito 🎉')
    },
    onError: (err: any) => {
      message.error(`Error al guardar receta final: ${err.message}`)
    }
  })
}
