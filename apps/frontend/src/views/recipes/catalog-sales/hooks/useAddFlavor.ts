import { useMutation, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { IProductFlavor } from '../../shared/types'
import { syncFlavor } from '../services/catalogSalesApi'

export const useAddFlavor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (flavor: IProductFlavor) => {
      await syncFlavor(flavor)
      return flavor
    },
    onSuccess: (data) => {
      message.success(`Sabor "${data.flavor}" agregado correctamente`)
      queryClient.invalidateQueries({queryKey: ['flavors-synced']}) 
    },
    onError: () => {
      message.error('Error al agregar sabor')
    }
  })
}
