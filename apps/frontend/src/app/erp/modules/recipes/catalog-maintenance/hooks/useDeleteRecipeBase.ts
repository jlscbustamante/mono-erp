// catalog-maintenance/hooks/useDeleteRecipeBase.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal, message } from 'antd'
import { deleteRecipeBase } from '../services/catalogMaintenanceApi'

export const useDeleteRecipeBase = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => deleteRecipeBase(id),
    onSuccess: () => {
      message.success('✅ Receta eliminada correctamente')
      queryClient.invalidateQueries({ queryKey: ['recipe-base-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al eliminar la receta base')
    }
  })

  const confirmAndDelete = (id: number, title: string) => {
    Modal.confirm({
      title: `¿Eliminar "${title}"?`,
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(id)
    })
  }

  return {
    deleteRecipeBase: confirmAndDelete,
    isLoading: mutation.isPending
  }
}
