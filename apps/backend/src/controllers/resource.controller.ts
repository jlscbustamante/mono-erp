import { NextFunction, Request, Response } from 'express'

import { CashAccount } from '../entities/CashAccount'
import { Category } from '../entities/Category'
import cashAccountRepository from '../repositories/cashAccount.repository'
import categoryRepository from '../repositories/category.repository'
import costCenterRepository from '../repositories/costCenter.repository'
import { ResourceService } from '../services/Resource.service'

const resourceService = new ResourceService(
  cashAccountRepository,
  categoryRepository,
  costCenterRepository,
)

export class ResourceController {
  async getCashAccounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { module } = req.query
      let cashAccounts: CashAccount[]
      switch (module) {
        case 'request':
          cashAccounts = await resourceService.getCashAccountsRequest()
          break
        case 'store':
          cashAccounts = await resourceService.getCashAccountsStore()
          break
        default:
          cashAccounts = await resourceService.getCashAccounts()
          break
      }
      res.status(200).json({ data: cashAccounts })
    } catch (err) {
      next(err)
    }
  }

  async getCategories(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { module } = req.query
      let cashAccounts: Category[]
      switch (module) {
        case 'request':
          cashAccounts = await resourceService.getCategoriesRequest()
          break
        case 'store':
          cashAccounts = await resourceService.getCategoriesStore()
          break
        default:
          cashAccounts = await resourceService.getCategories()
          break
      }
      res.status(200).json({ data: cashAccounts })
    } catch (err) {
      next(err)
    }
  }

  async getCostCenters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cashAccounts = await resourceService.getCostCenters()
      res.status(200).json({ data: cashAccounts })
    } catch (err) {
      next(err)
    }
  }
}
