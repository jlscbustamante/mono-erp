import { useState } from 'react'
import { message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { syncManyProducts, syncManyFlavors, syncManySizes } from '../services/catalogSalesApi'
import { IProduct, IProductFlavor, IProductSize } from '../../shared/types'


type MutationFn<T> = (data: T[]) => Promise<any>

export function useAddAllWithRefetch<T>(
  mutationFn: MutationFn<T>,
  refetch: () => void,
  entityName: string // productos, sabores, etc.
) {
  return useMutation({
    mutationFn,
    onSuccess: () => {
      message.success(`✅ ${entityName} agregados con éxito`)
      refetch()
    },
    onError: () => {
      message.error(`❌ Error al agregar ${entityName}`)
    },
  })
}

export function useAddAllProducts() {
  return useMutation({
    mutationFn: (products: IProduct[]) => syncManyProducts(products),
    onSuccess: () => message.success('Productos agregados con éxito'),
    onError: () => message.error('Error al agregar productos'),
  })
}

export function useAddAllFlavors() {
  return useMutation({
    mutationFn: (flavors: IProductFlavor[]) => syncManyFlavors(flavors),
    onSuccess: () => message.success('Sabores agregados con éxito'),
    onError: () => message.error('Error al agregar sabores'),
  })
}

export function useAddAllSizes() {
  return useMutation({
    mutationFn: (sizes: IProductSize[]) => syncManySizes(sizes),
    onSuccess: () => message.success('Tamaños agregados con éxito'),
    onError: () => message.error('Error al agregar tamaños'),
  })
}