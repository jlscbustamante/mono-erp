import type { Request, Response } from 'express'

import { catchError } from '../../../utils/decorators'
import { movementService } from './dependencies'

export class MovementController {
  @catchError
  async getInfoJob(req: Request, res: Response) {
    const { jobName } = req.query as { jobName: string }
    const info = await movementService.getInfoJob(jobName)
    return res.status(200).json({ data: info })
  }

  @catchError
  async listJobs(req: Request, res: Response) {
    const jobs = await movementService.listJobs()
    return res.status(200).json({ data: jobs })
  }

  @catchError
  async startGroupJob(req: Request, res: Response) {
    await movementService.startRun()

    return res.status(200).json({ message: 'ok' })
  }

  @catchError
  async clearJobs(req: Request, res: Response) {
    await movementService.clearJobs()
    return res.status(200).json({ message: 'ok' })
  }

  @catchError
  async getStatusRun(req: Request, res: Response) {
    const state = await movementService.getStatusRunJobs()
    return res.status(200).json({ data: state })
  }

  @catchError
  async getGroupsJob(req: Request, res: Response) {
    const groups = await movementService.getGroupsJob()
    return res.status(200).json({ data: groups })
  }

  @catchError
  async getAvailableJobs(req: Request, res: Response) {
    const jobs = await movementService.getJobs()
    return res.status(200).json({ data: jobs })
  }
}
