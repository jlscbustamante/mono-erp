import { Button } from 'antd'
import { useState } from 'react'

import * as sdk from '@/data/products/sdk'
import { useContextProduct } from '@/layout/ContextProduct'

export const ButtonDispatchToday = ({
  date,
  sucursalId,
  sucursalNombre,
  onSuccess,
}: {
  date: string
  sucursalId: string
  sucursalNombre: string
  onSuccess?: (storeCode: string) => void
}) => {
  const { messageApi } = useContextProduct()
  const [loading, setLoading] = useState(false)
  const onClick = async () => {
    try {
      setLoading(true)
      await sdk.createDispatchToday({
        date,
        sucursalId,
        sucursalNombre,
      })
      messageApi.success('Despacho creado', 1.6)
      onSuccess?.(sucursalId)
    } catch (err: any) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={onClick} loading={loading}>
      {loading ? 'Cargando...' : 'Despachar'}
    </Button>
  )
}
