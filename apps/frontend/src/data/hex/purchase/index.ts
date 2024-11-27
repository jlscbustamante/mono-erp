import { baseUrl } from '@/data/api/baseUrl'

import { Item, Purchase, PurchaseUpdaetDto } from '../types'

export const getPurchase = (id: number) => {
  return baseUrl<Purchase | null>('hex/purchase/getPurchase', {
    query: { id },
  })
}

export const getItems = () => {
  return baseUrl<Item[]>('hex/purchase/items')
}

export const getItemsActive = () => {
  return baseUrl<Item[]>('hex/purchase/items/active')
}

export const updatePurchase = (purchase: PurchaseUpdaetDto) => {
  return baseUrl<void>('hex/purchase/update', {
    method: 'PUT',
    body: {
      ...purchase,
      items: purchase.items.map((el) => ({ ...el, key: undefined })),
    },
  })
}
