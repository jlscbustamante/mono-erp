import { NextFunction, Request, Response } from 'express'

import { IamModule } from '../entities/IamModule'
import IamModuleRepository from '../repositories/iamModule.repository'
import { IamModuleService } from '../services/IamModule.service'
import { EnvFilters } from '../types'

const iamModuleService = new IamModuleService(IamModuleRepository)
export class IamModuleController {
  async getIamModule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listIamModule = await IamModuleRepository.find()
      res.status(200).json(listIamModule)
    } catch (err) {
      next(err)
    }
  }

  async getIamModuleOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamModule = await IamModuleRepository.findOne({
        where: {
          id: Number(req.query.IamModuleId),
        },
      })
      res.status(200).json(existingIamModule)
    } catch (err) {
      next(err)
    }
  }

  async updateIamModule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as { name: string; status: number }
      const existingIamModule = await IamModuleRepository.findOne({
        where: {
          id: Number(req.query.IamModuleId),
        },
      })
      if (!existingIamModule) {
        res.status(404).json({
          message: `Iam Module con ID ${req.params.IamModuleId} no encontrada`,
        })

        return
      }

      await iamModuleService.updateIamModule(existingIamModule, args)
      res
        .status(200)
        .json({ message: 'IamModule se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamModule(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        status: number
      }
      await iamModuleService.createIamModule(args)
      res.status(200).json({ message: 'IamModule se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamModuleNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamModule>
      const requests = await iamModuleService.getFilteredIamModuleNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
