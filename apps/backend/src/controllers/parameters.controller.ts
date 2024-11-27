import { NextFunction, Request, Response } from 'express'

import { Parameter } from '../entities/Parameter'
import parameterRepository from '../repositories/parameter.repository'
import { ParametersService } from '../services/Parameters.service'
import { EnvFilters } from '../types'

const parametersService = new ParametersService(parameterRepository)
export class ParametersController {
  async updateParameters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        type: string
        name: string
        value: string
        role: string
        status: 0 | 1
      }
      const existingParameter = await parameterRepository.findOne({
        where: {
          id: Number(req.query.parameterId),
        },
      })
      if (!existingParameter) {
        res.status(404).json({
          message: `Parameter con ID ${req.params.parameterId} no encontrada`,
        })

        return
      }
      await parametersService.updateParameters(existingParameter, args)
      res
        .status(200)
        .json({ message: 'Parameter se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getParameters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listParameters = await parameterRepository.find()
      res.status(200).json(listParameters)
    } catch (err) {
      next(err)
    }
  }

  async getParametersOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingParameter = await parameterRepository.findOne({
        where: {
          id: Number(req.query.parameterId),
        },
      })
      res.status(200).json(existingParameter)
    } catch (err) {
      next(err)
    }
  }

  async createParameters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        type: string
        name: string
        value: string
        role: string
        status: 0 | 1
      }
      await parametersService.createParameters(args)
      res.status(200).json({ message: 'Parameter se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilterParameters(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<Parameter>
      const requests = await parametersService.getFilteredParametersNt(queries)
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
