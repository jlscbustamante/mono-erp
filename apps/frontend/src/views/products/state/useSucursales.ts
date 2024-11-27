import { useEffect, useState } from 'react'

import { ISucursal } from '@/data/maintenance/Sucursal/type/Sucursal'
import * as sdk from '@/data/products/sdk'

export const useSucursales = () => {
  const [loading] = useState(false)
  const [sucursales, setSucursales] = useState<ISucursal[]>([])

  const loadSucursales = async () => {
    try {
      const sus = await sdk.getSucursalList()
      setSucursales(sus)
    } catch (err: any) {
      console.log(err)
      return []
    }
  }

  useEffect(() => {
    loadSucursales()
  }, [])

  return {
    isLoading: loading,
    sucursales: sucursales,
  }
}
