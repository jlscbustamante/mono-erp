import { Router } from 'express'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import { driverController } from './dependencies'

export const driverEndpoints = (app: Router) => {
  app.get('/driver/filter', parseFilters, driverController.filterDriver)
}
