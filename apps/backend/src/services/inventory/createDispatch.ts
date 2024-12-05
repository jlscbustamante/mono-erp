import { format } from 'date-fns'
import { In } from 'typeorm'

import { InvDispatch, InvDispatchItem } from 'pizzadb'
import { productItemRepository } from '../../repositories/inventory/item.repository'

export const createDispatchFN = async (
  body: Partial<InvDispatch> & { storeId: string },
) => {
  const storeId = body.storeId
  const moveAt = body.moveAt ?? format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  // const warehouse = await invWarehouseRepository.findOne({
  //   where: { sucursalId: storeId ?? -1 },
  // })
  // if (!warehouse)
  //   throw badRequest(`No se encontro almacen para la sucursal ${storeId}`)
  const dispatch = new InvDispatch()
  // dispatch.wareToId = warehouse!.id
  dispatch.wareToId = storeId
  dispatch.gloss = body.gloss ?? ''
  dispatch.moveAt = moveAt
  dispatch.createdBy = body.createdBy!
  dispatch.status = 1

  const itemIds = body.items!.map((item) => item.itemId)
  const items = await productItemRepository.find({ where: { id: In(itemIds) } })
  const dispatchItems = items.map((item) => {
    const itemDispatch = new InvDispatchItem()
    itemDispatch.itemId = item.id
    itemDispatch.itemName = item.itemName
    itemDispatch.presentationId = item.presentationId

    itemDispatch.unitValue = item.unitPrice
    itemDispatch.quantity =
      body.items?.find((el) => el.itemId == item.id)?.quantity ?? 0
    itemDispatch.totalValue = item.unitPrice * itemDispatch.quantity

    return itemDispatch
  })

  const netValue = dispatchItems.reduce((acc, item) => acc + item.totalValue, 0)
  dispatch.netValue = netValue
  dispatch.totalValue = netValue
  dispatch.items = dispatchItems

  return dispatch
}
