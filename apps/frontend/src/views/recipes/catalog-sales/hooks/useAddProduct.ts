import { useMutation, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { IProduct } from '../../shared/types'
import { syncProduct } from '../services/catalogSalesApi'

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: IProduct) => {
      // 🧪 Sincronizacion

      await syncProduct(product)
      return product
    },
    onSuccess: (data) => {
      message.success(`Producto "${data.product}" agregado correctamente`)
      queryClient.invalidateQueries({queryKey: ['products-synced']}) // Actualiza la lista
    },
    onError: () => {
      message.error('Error al agregar producto')
    }
  })
}
