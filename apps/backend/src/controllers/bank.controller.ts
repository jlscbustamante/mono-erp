import { Request, Response } from 'express'

import { BankReconciliation } from '../entities/BnkReconcilation'
import { BankService } from '../services/Bank.service'
import { EnvFilters, IToken } from '../types'
import { catchError } from '../utils/decorators/'
import { safeAny } from '../utils/someAny'

const bankService = new BankService()

export class BankController {
  @catchError
  async filter(req: Request, res: Response): Promise<void> {
    const filters = req.query as EnvFilters<BankReconciliation>
    const data = await bankService.filter(filters)

    res.json({ data, message: 'hi' })
  }

  @catchError
  async getFirstReconciliation(req: Request, res: Response): Promise<void> {
    const data = await bankService.getFirstReconciliation()

    res.json({ data })
  }

  @catchError
  async reconcileTransactionToRequest(
    req: Request,
    res: Response,
  ): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    const { transactionkey } = req.params
    const data = req.body as {
      requirement_id: number
      requirement_description: string
      requirement_amount: number
    }

    await bankService.reconcileTransaction(transactionkey, data, token.name)

    res.json({ message: 'Transaccion actualizada' })
  }
}
