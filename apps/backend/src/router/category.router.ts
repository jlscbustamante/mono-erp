import { Application } from 'express'
import Joi from 'joi'

import { CategoryController } from '../controllers/category.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'
import validateSchema from '../middleware/validators/validateSchema'
import { iamLogger } from '../middleware/iamlog-middleware'

const categoryController = new CategoryController()
export const loadCategoryEndpoints = (app: Application): void => {
  app.put(
    '/api/category/update-category',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        categoryId: Joi.number().integer().required(),
      }),
      'query',
    ),
    iamLogger,
    categoryController.updateCategory,
  )
  app.get(
    '/api/category/get-category',
    validateToken,
    categoryController.getCategory,
  )
  app.post(
    '/api/category/create-category',
    validateToken,
    validatePermission,
    iamLogger,
    categoryController.createCategory,
  )
  app.get(
    '/api/category/get-category-one',
    validateToken,
    validatePermission,
    validateSchema(
      Joi.object({
        categoryId: Joi.number().integer().required(),
      }),
      'query',
    ),
    categoryController.getCategoryOne,
  )
  app.post(
    '/api/category/filter',
    validateToken,
    validatePermission,
    categoryController.getFilteredCategory,
  )

  app.get(
    '/api/category/accountFather',
    validateToken,
    categoryController.getAccountFather,
  )
}
