import { Application } from 'express'

import { ParameterController } from './controller'

const controller = new ParameterController()
export const paramterEndpoints = (app: Application): void => {
  app.get('/api/hex/parameters/public', controller.getPublic)
}
