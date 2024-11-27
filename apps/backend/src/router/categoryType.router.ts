import { Application } from 'express'
import Joi from 'joi'

import { CategoryTypeController } from '../controllers/categoryType.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'

const categoryTypeController = new CategoryTypeController()
export const loadCategoryTypeEndpoints = (app: Application): void => {
  app.put(
    '/api/category/update-categoryType',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        categoryTypeId: Joi.number().integer().required(),
      }),
      'query',
    ),
    categoryTypeController.updateTypeCategory,
  )
  app.get(
    '/api/category/get-categoryType',
    validateToken,

    categoryTypeController.getTypeCategory,
  )
  app.post(
    '/api/category/create-categoryType',
    validateToken,
    validatePermission,
    categoryTypeController.createTypeCategory,
  )
  app.get(
    '/api/category/get-categoryType-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        categoryTypeId: Joi.number().integer().required(),
      }),
      'query',
    ),
    categoryTypeController.getTypeCategory,
  )
  app.get(
    '/api/category-type/filter',
    validateToken,

    categoryTypeController.getFilterCategoryType,
  )
}
