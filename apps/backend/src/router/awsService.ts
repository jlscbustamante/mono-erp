import { Application } from 'express'
import Joi from 'joi'

import { nameJobs } from '../const/awsJobs'
import { validateToken } from '../middleware/jwt/validateToken'
import validateSchema from '../middleware/validators/validateSchema'
import { AwsService } from '../services/Aws.service'

const awsService = new AwsService()

export const loadAwsServiceEndpoints = (app: Application) => {
  app.get('/api/awsServices/getProcessGlu', validateToken, (re, res) => {
    res.json({ data: nameJobs })
  })

  app.post(
    '/api/awsServices/startJob',
    validateToken,
    validateSchema(Joi.object({ name: Joi.string().required() })),
    async (req, res, next) => {
      try {
        const { name } = req.body
        const info = await awsService.startJob(name)
        res.json({
          data: info,
        })
      } catch (err) {
        next(err)
      }
    },
  )

  app.post(
    '/api/awsServices/verifyStatusJob',
    validateToken,
    validateSchema(
      Joi.object({
        jobId: Joi.string().required(),
        name: Joi.string().required(),
      }),
    ),
    async (req, res, next) => {
      try {
        const { jobId, name } = req.body
        const info = await awsService.verifyStatusJob(name, jobId)
        res.json({
          data: info,
        })
      } catch (err) {
        next(err)
      }
    },
  )
}
