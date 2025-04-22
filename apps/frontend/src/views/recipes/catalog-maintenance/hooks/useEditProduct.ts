import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { IProduct } from '../../shared/types'
import { baseUrl } from '@/data/api/baseUrl'
import { editProduct } from '../services/catalogMaintenanceApi'

export const useEditProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      message.success('✅ Producto actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['products-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al actualizar producto')
    }
  })
}