import { Application } from 'express'
import Joi from 'joi'

import { CostCenterController } from '../controllers/costCenter.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const costCenterController = new CostCenterController()

export const loadCostCenterEndopoints = (app: Application): void => {
  app.get(
    '/api/cost-centers',
    validateToken,
    validatePermission,
    costCenterController.getCostCenters,
  )
  app.get(
    '/api/cost-centers/get-cost-centers',
    costCenterController.getCostCenter,
  )
  app.get(
    '/api/cost-centers-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        costCenterId: Joi.number().integer().required(),
      }),
      'query',
    ),
    costCenterController.getCostCentersOne,
  )
  app.put(
    '/api/cost-centers/update-cost-centers',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        costCenterId: Joi.number().integer().required(),
      }),
      'query',
    ),
    costCenterController.updateCostCenter,
    app.post(
      '/api/cost-centers/create-cost-centers',
      validateToken,
      validatePermission,
      costCenterController.createCostCenter,
    ),
    app.post(
      '/api/cost-center/filter',
      validateToken,
      validatePermission,
      costCenterController.getFilterCostCenter,
    ),
  )

  app.get(
    '/api/cost/center/getAccount',
    validateToken,
    costCenterController.getAccount,
  )
}
