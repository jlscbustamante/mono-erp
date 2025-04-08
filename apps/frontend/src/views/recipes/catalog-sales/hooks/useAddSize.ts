import { useMutation, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { IProductSize } from '../../shared/types'
import { syncSize } from '../services/catalogSalesApi'

export const useAddSize = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (size: IProductSize) => {
      await syncSize(size)
      return size
    },
    onSuccess: (data) => {
      message.success(`Tamaño "${data.size}" agregado correctamente`)
      queryClient.invalidateQueries({ queryKey: ['sizes-synced'] }) // Actualiza la lista
    },
    onError: () => {
      message.error('Error al agregar tamaño')
    }
  })
}
