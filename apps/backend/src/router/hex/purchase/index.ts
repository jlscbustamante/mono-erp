import { Application } from 'express'

import validateSchema from '../../../middleware/validators/validateSchema'
import { PurchaseController } from './controller'
import { idPurchaseSchema, updatePurchaseSchema } from './schemas'

const controller = new PurchaseController()
export const purchaseEndpoints = (app: Application): void => {
  app.get(
    '/api/hex/purchase/getPurchase',
    validateSchema(idPurchaseSchema, 'query'),
    controller.getPurchase,
  )

  app.get('/api/hex/purchase/items', controller.getItemsAvailable)

  app.get('/api/hex/purchase/items/active', controller.getItemsAvailableActive)

  app.put(
    '/api/hex/purchase/update',
    validateSchema(updatePurchaseSchema),
    controller.updatePurchase,
  )
}
