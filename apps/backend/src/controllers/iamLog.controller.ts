import { NextFunction, Request, Response } from 'express'

import { IamLog } from '../entities/IamLog'
import iamLogRepository from '../repositories/iamLog.repository'
import { IamLogService } from '../services/IamLog.service'
import { EnvFilters } from '../types'

const iamLogService = new IamLogService(iamLogRepository)
export class IamLogController {
  async getIamLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listIamLog = await iamLogRepository.find()
      res.status(200).json(listIamLog)
    } catch (err) {
      next(err)
    }
  }

  async getIamLogOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamLog = await iamLogRepository.findOne({
        where: {
          id: Number(req.query.iamLogId),
        },
      })
      res.status(200).json(existingIamLog)
    } catch (err) {
      next(err)
    }
  }

  async updateIamLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        id: number
        user_id: number
        module_id: number
        action: string
        script: string
      }
      const existingIamLog = await iamLogRepository.findOne({
        where: {
          id: Number(req.query.iamLogId),
        },
      })
      if (!existingIamLog) {
        res.status(404).json({
          message: `IamLog con ID ${req.params.iamLogId} no encontrada`,
        })

        return
      }

      await iamLogService.updateIamLog(existingIamLog, args)
      res
        .status(200)
        .json({ message: 'IamLog se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamLog(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        id: number
        user_id: number
        module_id: number
        action: string
        script: string
      }
      await iamLogService.createIamLog(args)
      res.status(200).json({ message: 'IamLog se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamLogNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamLog>
      const requests = await iamLogService.getFilteredIamLogNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
