import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { IProductFlavor } from '@/views/recipes/shared/types'
import { createFlavor } from '../services/recipeFinalService'

export const useCreateFlavor = () => {
  return useMutation({
    mutationFn: createFlavor,
    onSuccess: (data: IProductFlavor) => {
      message.success(`Sabor "${data.flavor}" creado correctamente`)
    },
    onError: (err: any) => {
      message.error(`Error al crear sabor: ${err.message}`)
    }
  })
}
