// catalog-maintenance/hooks/useEditRecipeBase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { editRecipeBase } from '../services/catalogMaintenanceApi'

export const useEditRecipeBase = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editRecipeBase,
    onSuccess: () => {
      message.success('✅ Receta base actualizada correctamente')
      queryClient.invalidateQueries({ queryKey: ['recipe-base-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al actualizar la receta base')
    }
  })
}
