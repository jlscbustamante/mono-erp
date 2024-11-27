import { Router } from 'express'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import { commonController } from './dependencies'

export const commonEndopoints = (app: Router) => {
  app.get(
    '/common/sucursal/filter',
    parseFilters,
    commonController.filterWarehouse,
  )
}
