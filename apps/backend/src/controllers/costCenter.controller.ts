import { NextFunction, Request, Response } from 'express'

import { CostCenter } from '../entities/CostCenter'
import accountRepository from '../repositories/account.repository'
import costCenterRepository from '../repositories/costCenter.repository'
import { CostCenterService } from '../services/CostCenter.service'
import { EnvFilters } from '../types'
import { CostCenterStatus } from '../types/costCenter'
import { Filters3 } from '../types/filter'

const costCenterService = new CostCenterService(costCenterRepository)

export class CostCenterController {
  async getCostCenters(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const costCenters = await costCenterService.getAll()
      response.status(200).json(costCenters)
    } catch (err) {
      next(err)
    }
  }

  async getCostCenter(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const costCenters = await costCenterRepository.find()
      response.status(200).json(costCenters)
    } catch (err) {
      next(err)
    }
  }

  async getCostCentersOne(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingCostCenter = await costCenterRepository.findOne({
        where: {
          id: Number(req.query.costCenterId),
        },
      })
      response.status(200).json(existingCostCenter)
    } catch (err) {
      next(err)
    }
  }

  async updateCostCenter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        origin: string
        account_caja: number
        account_ajuste: number
        account_merca: number
        is_cash: 0 | 1
        status: CostCenterStatus
      }
      const existingCostCenter = await costCenterRepository.findOne({
        where: {
          id: Number(req.query.costCenterId),
        },
      })
      if (!existingCostCenter) {
        res.status(404).json({
          message: `CostCenter con ID ${req.params.cashAccountId} no encontrado`,
        })

        return
      }
      const UpdData = await costCenterService.updateCostCenter(
        existingCostCenter,
        args,
      )
      res
        .status(200)
        .json({
          dataTrace: UpdData,
          message: 'CostCenter se ha actualizado correctamente',
        })
    } catch (err) {
      next(err)
    }
  }

  async createCostCenter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        origin: string
        account_caja: number
        account_ajuste: number
        account_merca: number
        is_cash: 0 | 1
        status: CostCenterStatus
      }
      const CreateData = await costCenterService.createMenuReport(args)
      res
        .status(200)
        .json({
          dataTrace: CreateData,
          message: 'CostCenter se ha creado correctamente',
        })
    } catch (err) {
      next(err)
    }
  }

  async getFilterCostCenter(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.body as Filters3<CostCenter>
      const { data: requests } = await costCenterRepository.filter3({
        select: {
          account: {
            account: true,
          },
          account_ajustes: {
            account: true,
          },
          account_mercas: {
            account: true,
          },
        },
        filters: queries,
        relations: {
          account: true,
          account_ajustes: true,
          account_mercas: true,
        },
      })
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async getAccount(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accounts = await accountRepository.find({
        where: {
          status: '1',
          is_father: 0,
        },
      })
      response.status(200).json(accounts)
    } catch (err) {
      next(err)
    }
  }
}
