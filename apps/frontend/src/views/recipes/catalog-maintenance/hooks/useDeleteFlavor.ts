import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Modal, message } from 'antd'
import { deleteFlavor } from '../services/catalogMaintenanceApi'

export const useDeleteFlavor = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => deleteFlavor(id),
    onSuccess: () => {
      message.success('✅ Sabor eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['flavor-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al eliminar el sabor')
    }
  })

  const confirmAndDelete = (id: number, flavorName: string) => {
    Modal.confirm({
      title: `¿Eliminar "${flavorName}"?`,
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(id)
    })
  }

  return {
    deleteFlavor: confirmAndDelete,
    isLoading: mutation.isPending
  }
}
