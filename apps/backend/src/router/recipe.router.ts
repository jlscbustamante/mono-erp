import { Application } from 'express'

//import { RecipeController } from '../controllers/recipe.controller'
import { validateToken } from '../middleware/jwt/validateToken'
import { validatePermission } from '../middleware/validatePermission/validatePermission'

//const categoryController = new CategoryController()
export const loadInsumoEndpoints = (app: Application): void => {
  app.post(
    '/api/insumo/filter',
    validateToken,
    validatePermission,
    categoryController.getFilteredCategory,
  )
}
