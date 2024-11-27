import { NextFunction, Request, Response } from 'express'

import balanceRepository from '../repositories/balance.repository'
import { BalanceService } from '../services/Balance.service'

const balanceService = new BalanceService(balanceRepository)

export class BalanceController {
  async getBalance(
    _: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const balance = await balanceService.getAll()
      response.status(200).json({ balance })
    } catch (err: any) {
      next(err)
    }
  }
}
