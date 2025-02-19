import Joi from 'joi'

import {
  PurchaseItemUpdate,
  PurchaseUpdaetDto,
} from '../../../core/inventory/dto'
import { PURCHASE_STATUS } from '../../../core/inventory/entities/purchase'

export const idPurchaseSchema = Joi.object({
  id: Joi.number().required(),
})

export const updatePurchaseSchema = Joi.object<PurchaseUpdaetDto>({
  id: Joi.number().required(),
  gloss: Joi.string().allow('').required(),
  discount: Joi.number().required(),
  taxValue: Joi.number().allow(null).required(),
  purchaseAt: Joi.date().iso().required(),
  warehouseId: Joi.string().allow(''),
  numGuide: Joi.string().allow('').required(),
  numInvoice: Joi.string().allow('').required(),
  status: Joi.string().equal(PURCHASE_STATUS.NEW).required(),
  supplierId: Joi.number().required(),
  supplierName: Joi.string(),
  supplierRuc: Joi.string(),
  items: Joi.array()
    .items(
      Joi.object<PurchaseItemUpdate>({
        id: Joi.number(),
        purchaseId: Joi.number().required(),
        quantity: Joi.number().required(),
        itemName: Joi.string().required(),
        presentationId: Joi.number().required(),
        presentationName: Joi.string().required(),
        totalValue: Joi.number().required(),
        unitValue: Joi.number().required(),
        itemId: Joi.number().required(),
      }),
    )
    .required(),
})
