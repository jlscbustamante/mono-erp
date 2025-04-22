import { message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { syncManyProducts, syncManySizes, syncManyFlavors, syncManyProductsWithSizes } from '../services/catalogSalesApi'
import { SyncProductWithSizesAndFlavorsDto } from '../../shared/dtos/Catalog.dto'

export function useAddAllWithRefetch(
  refetch: () => void
) {
  return useMutation({
    mutationFn: async (productsWithSizeAndFlavors: SyncProductWithSizesAndFlavorsDto[]) => {

      // 2. Hacer requests en paralelo
      await syncManyProductsWithSizes(productsWithSizeAndFlavors)
    },

    onSuccess: () => {
      message.success('✅ Productos y sus dependencias agregados con éxito')
      refetch()
    },

    onError: () => {
      message.error('❌ Error al agregar productos o sus dependencias')
    }
  })
}
