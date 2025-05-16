import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { CreateFlavorWithIngredientsDto } from '../../shared/dtos/CreateRecipe.dto'
import { createFlavorWithIngredients } from '../services/recipeFinalService'

export const useCreateFlavorWithIngredients = () => {
  return useMutation({
    mutationFn: (payload: CreateFlavorWithIngredientsDto) => createFlavorWithIngredients(payload),
    onSuccess: () => {
      message.success('Sabor creado correctamente')
    },
    onError: (err: any) => {
      message.error(`Error al crear sabor: ${err.message}`)
    }
  })
}
