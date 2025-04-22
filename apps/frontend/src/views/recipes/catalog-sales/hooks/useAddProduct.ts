import { useMutation, useQueryClient } from '@tanstack/react-query'

import { message } from 'antd'
import { syncProduct } from '../services/catalogSalesApi'
import { SyncProductWithSizesAndFlavorsDto } from '../../shared/dtos/Catalog.dto'

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (product: SyncProductWithSizesAndFlavorsDto) => {
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
