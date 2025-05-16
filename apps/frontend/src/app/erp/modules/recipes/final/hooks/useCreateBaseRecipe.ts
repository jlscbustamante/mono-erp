import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { createBaseRecipe } from '../services/recipeFinalService'
import { IRecipeBase } from '@/views/recipes/shared/types'


export const useCreateBaseRecipe = () => {
  return useMutation({
    mutationFn: createBaseRecipe,
    onSuccess: (data: IRecipeBase) => {
      message.success(`Receta base "${data.title}" creada con éxito`)
    },
    onError: (err: any) => {
      message.error(`Error al crear receta base: ${err.message}`)
    }
  })
}
