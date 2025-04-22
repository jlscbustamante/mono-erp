import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { deleteProduct } from '../services/catalogMaintenanceApi'

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      message.success('✅ Producto eliminado correctamente')
      queryClient.invalidateQueries({ queryKey: ['products-maintenance'] })
    },
    onError: () => {
      message.error('❌ Error al eliminar producto')
    }
  })

  const confirmAndDelete = (id: number, productName: string) => {
    Modal.confirm({
      title: `¿Eliminar "${productName}"?`,
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => mutation.mutate(id)
    })
  }

  return {
    deleteProduct: confirmAndDelete,
    isLoading: mutation.isPending
  }
}
