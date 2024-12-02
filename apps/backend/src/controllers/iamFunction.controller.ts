import { NextFunction, Request, Response } from 'express'

import { IamFunction } from 'pizzadb'
import IamFunctionRepository from '../repositories/iamFuction.repository'
import { IamFunctionService } from '../services/IamFunction.service'
import { EnvFilters } from '../types'

const iamFunctionService = new IamFunctionService(IamFunctionRepository)
export class IamFunctionController {
  async getIamFunction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listIamFunction = await IamFunctionRepository.find()
      res.status(200).json(listIamFunction)
    } catch (err) {
      next(err)
    }
  }

  async getIamFunctionOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamFunction = await IamFunctionRepository.findOne({
        where: {
          id: Number(req.query.iamFunctionId),
        },
      })
      res.status(200).json(existingIamFunction)
    } catch (err) {
      next(err)
    }
  }

  async updateIamFunction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        module_id: number
        status: number
      }
      const existingiamFunction = await IamFunctionRepository.findOne({
        where: {
          id: Number(req.query.iamFunctionId),
        },
      })
      if (!existingiamFunction) {
        res.status(404).json({
          message: `IamFunction con ID ${req.params.iamFunctionId} no encontrada`,
        })

        return
      }

      await iamFunctionService.updateIamFunction(existingiamFunction, args)
      res
        .status(200)
        .json({ message: 'IamFunction se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamFunction(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        module_id: number
        status: number
      }
      await iamFunctionService.createIamFunction(args)
      res
        .status(200)
        .json({ message: 'IamFucntion se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamFunctionNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamFunction>
      const requests =
        await iamFunctionService.getFilteredIamFunctionNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
