import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { syncManyProductsWithSizes } from '../services/catalogSalesApi'
import { buildSyncPayload } from '../utils/buildSyncPayload'
import { SyncProductWithSizesAndFlavorsDto } from '../../shared/dtos/Catalog.dto'

export const useSyncProductsModal = (
  messageApi: ReturnType<typeof message.useMessage>[0],
  onSuccess?: () => void,
) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (rawProducts: SyncProductWithSizesAndFlavorsDto[]) => {
      const payload = buildSyncPayload(rawProducts)
      console.log('Payload a sincronizar: ', payload)
      return await syncManyProductsWithSizes(payload)
    },
    onSuccess: () => {
      messageApi.success(`✅ Sincronizados...`)
      onSuccess?.()
    },
    onError: () => {
      messageApi.error('❌ Error al sincronizar productos')
    },
  })

  return {
    syncProducts: mutate,
    isSyncing: isPending,
  }
}
