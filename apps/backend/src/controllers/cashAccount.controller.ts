import { NextFunction, Request, Response } from 'express'

import { AppDataSource } from '../config/database'
import { Account } from '../entities/Account'
import { CashAccount } from '../entities/CashAccount'
import balanceRepository from '../repositories/balance.repository'
import cashAccountRepository from '../repositories/cashAccount.repository'
import cashMoveRepository from '../repositories/cashMove.repository'
import categoryRepository from '../repositories/category.repository'
import costCenterRepository from '../repositories/costCenter.repository'
import RequestRepository from '../repositories/request.repository'
import { CashAccountService } from '../services/CashAccount.service'
import { CloseCashAccount } from '../services/cashAccount/CloseCashAccount'
import { ResourceService } from '../services/Resource.service'
import { EnvFilters } from '../types'
import { BalanceStatus } from '../types/balance'
import { CashAccountStatus, CashAccountTypeStatus } from '../types/cashAccount'
import { Filters3 } from '../types/filter'
import { catchError } from '../utils/decorators'

const resourceService = new ResourceService(
  cashAccountRepository,
  categoryRepository,
  costCenterRepository,
)
const cashAccountService = new CashAccountService(
  cashAccountRepository,
  balanceRepository,
  cashMoveRepository,
  RequestRepository,
  resourceService,
)

const closeCashAccountService = new CloseCashAccount(
  cashAccountService,
  RequestRepository,
  cashMoveRepository,
)

export class CashAccountController {
  async getInitialBalanceRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date, cashAccountId } = req.query
      const balance = await cashAccountService.initialBalance(
        Number(cashAccountId),
        date as string,
        'request',
      )
      res.status(200).json({ data: balance })
    } catch (err) {
      next(err)
    }
  }

  async getBalanceReportRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dates, module } = req.query
      const balances = await cashAccountService.getBalanceReport(
        dates as string[],
        module as 'request' | 'store',
      )
      res.json({ data: balances })
    } catch (err: any) {
      next(err)
    }
  }

  @catchError
  async getAllStatesPayment(req: Request, res: Response): Promise<void> {
    const estadosIzipay: { estado: string }[] = await AppDataSource.query(
      'SELECT DISTINCT estado FROM ext_pagos_izipay WHERE estado IS NOT NULL and estado!=""',
    )
    const estadoCulqi: { estado: string }[] = await AppDataSource.query(
      'SELECT DISTINCT estado FROM ext_pagos_culqi WHERE estado IS NOT NULL and estado!=""',
    )
    const allEstados: string[] = [
      ...estadoCulqi.map((el) => el.estado),
      ...estadosIzipay.map((el) => el.estado),
    ]

    res.json({
      states: allEstados,
    })
  }

  async getInitialBalanceStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date, cashAccountId } = req.query as unknown as {
        date: string
        cashAccountId: number
      }
      const cash = await cashAccountRepository.findOne({
        where: {
          id: cashAccountId,
        },
      })
      if (!cash) throw new Error('Caja no encontrada')
      const code = cash.codefis
      const balancePepe = await initialBalancePepeTiendas({
        date: date as string,
        storeCode: code,
      })
      if (balancePepe != null) {
        const bhalance = {
          balance: balancePepe,
          status: BalanceStatus.NONE,
          date,
          cashId: cashAccountId,
        }
        res.status(200).json({ data: bhalance })
      } else {
        const balance = await cashAccountService.initialBalance(
          Number(cashAccountId),
          date as string,
          'store',
        )
        res.status(200).json({ data: balance })
      }
    } catch (err) {
      next(err)
    }
  }

  async getReportRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date } = req.query
      const report = await cashAccountService.reportRequest(date as string)
      res.status(200).json({ data: report })
    } catch (err) {
      next(err)
    }
  }

  async getDetailedReportRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { date, cashAccountId } = req.query
      const report = await cashAccountService.detailedReportRequest(
        Number(cashAccountId),
        date as string,
      )
      res.status(200).json({ data: report })
    } catch (err) {
      next(err)
    }
  }

  async closeCashAccounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        cashAccountIds: number[]
        date: string
        type: 'store' | 'request'
        replace?: boolean
        force?: boolean
      }
      let logs: undefined | string[] = undefined
      if (args.type == 'request') {
        logs = await closeCashAccountService.closeCashAccountsRequest(
          args.cashAccountIds,
          [args.date, args.date],
          { replace: args.replace, force: args.force },
        )
      } else {
        logs = await closeCashAccountService.closeCashAccountsStore(
          args.cashAccountIds,
          [args.date, args.date],
          { replace: args.replace, force: args.force },
        )
      }
      if (logs)
        res.status(400).json({ message: 'Error al validar datos', logs })
      else
        res.status(200).json({
          message: 'Las cajas se han cerrado correctamente',
          logs: null,
        })
    } catch (err) {
      next(err)
    }
  }

  async updateCashAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        account_id: number
        type_cash_id: number
        codefis: string
        status: CashAccountStatus
        account: Account
        sucursal_id: string
        roles_id: number
      }

      const existingCashAccount = await cashAccountRepository.findOne({
        where: {
          id: Number(req.query.cashAccountId),
        },
      })
      if (!existingCashAccount) {
        res.status(404).json({
          message: `Caja con ID ${req.params.cashAccountId} no encontrada`,
        })

        return
      }
      await cashAccountService.updateCashAccount(existingCashAccount, args)
      res
        .status(200)
        .json({ message: 'La caja se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async updateTypeChash(
    _req: Request,
    _res: Response,
    _next: NextFunction,
  ): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getCashAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cashAccounts = await cashAccountRepository.find()
      res.status(200).json(cashAccounts)
    } catch (err) {
      next(err)
    }
  }

  async getCashAccountOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingCashAccount = await cashAccountRepository.findOne({
        where: {
          id: Number(req.query.cashAccountId),
        },
      })
      res.status(200).json(existingCashAccount)
    } catch (err) {
      next(err)
    }
  }

  async getTypeCashAccountOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      throw new Error('Method not implemented.')
    } catch (err) {
      next(err)
    }
  }

  async getTypeCashAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      throw new Error('Method not implemented.')
    } catch (err) {
      next(err)
    }
  }

  async getFilteredNts(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cashAccountByName = await cashAccountRepository.find({
        where: {
          name: String(req.query.nameCash),
        },
      })

      response.json(cashAccountByName)
    } catch (error) {
      next(error)
      response.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  async getFilteredNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.body as Filters3<CashAccount>
      const { data: requests } = await cashAccountRepository.filter3({
        select: {
          account: {
            account: true,
          },
        },
        filters: queries,
        relations: {
          account: true,
        },
      })

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async getFilteredTypeNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<any>
      const requests = await cashAccountService.getFilteredTypeNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async createCashBalance(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accountId = req.query.accountId as string
      const accountIdNumber = parseInt(accountId, 10)
      const dateParam = req.query.date as string | undefined
      const date = dateParam ? new Date(dateParam) : new Date()
      if (!isNaN(accountIdNumber)) {
        await cashAccountService.createCashBalance(
          accountIdNumber,
          Number(req.query.monto),
          date,
          String(req.query.name),
        )
        response
          .status(200)
          .json({ message: 'Balance se ha creado correctamente' })
      } else {
        response
          .status(400)
          .json({ message: 'accountId no es un número válido' })
      }
    } catch (err) {
      next(err)
    }
  }

  async createCashAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        account_id: number
        roles_id: number
        sucursal_id: string
        type_cash_id: number
        codefis: string
        status: CashAccountStatus
        account: Account
      }
      await cashAccountService.createCashAccount(args)
      res
        .status(200)
        .json({ message: 'CashAccount se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createTypeCashAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        type_id: string
        status: CashAccountTypeStatus
      }
      await cashAccountService.createTypeCashAccount(args)
      res
        .status(200)
        .json({ message: 'TypeCashAccount se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }
}

interface ResponseApi {
  statusCode: number
  statusMessage: string
  result: {
    message: string
    value: null | number
    success: boolean
  }
  date: null
  error: null
}

const initialBalancePepeTiendas = async ({
  date,
  storeCode,
}: {
  date: string
  storeCode: string
}) => {
  try {
    const requestt = await fetch(
      `https://pos.pizzaraul.com/api/store/storeOpenExt?store_code=${storeCode}&date=${date}`,
    )
    if (!requestt.ok) throw new Error(requestt.statusText)
    const response: ResponseApi = await requestt.json()
    if (response.result.success) {
      if (!response.result.value) return 0
      return Number(response.result.value)
    }
    return null
  } catch (err) {
    console.log('ERROR : API POS : ', err)
    return null
  }
}
