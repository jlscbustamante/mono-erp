import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { IProductFlavor } from '../../shared/types'
import { editFlavor } from '../services/catalogMaintenanceApi'


export const useEditFlavor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editFlavor,
    onSuccess: () => {
      message.success('✅ Sabor actualizado correctamente')
      queryClient.invalidateQueries({ queryKey: ['flavor-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al actualizar el sabor')
    }
  })
}
