import { NextFunction, Request, Response } from 'express'

import { CashMove } from '../entities/CashMove'
import balanceRepository from '../repositories/balance.repository'
import cashAccountRepository from '../repositories/cashAccount.repository'
import cashBalanceRepository from '../repositories/cashBalance.repository'
import cashMoveRepository from '../repositories/cashMove.repository'
import cashTypeAccountRepository from '../repositories/cashTypeAccount.repository'
import categoryRepository from '../repositories/category.repository'
import costCenterRepository from '../repositories/costCenter.repository'
import RequestRepository from '../repositories/request.repository'
import { CashAccountService } from '../services/CashAccount.service'
import { CashMoveService } from '../services/CashMove.service'
import { CompareBalancesEfis } from '../services/cashMoves/CompareBalancesEfis'
import { ResourceService } from '../services/Resource.service'
import { Filters, IToken } from '../types'
import { OpFilter } from '../types/filter'
import { catchError } from '../utils/decorators'
import { safeAny } from '../utils/someAny'

const cashMoveService = new CashMoveService(
  cashMoveRepository,
  cashBalanceRepository,
)

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
  cashTypeAccountRepository,
)

const compareBalancesEfis = new CompareBalancesEfis(
  cashMoveRepository,
  resourceService,
  cashAccountService,
)

export class CashMoveController {
  async getCashMoves(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query: safeAny = req.query
      const cashMoves = await cashMoveService.getFiltered(
        query as Filters<CashMove>,
      )
      response.status(200).json({ data: cashMoves })
    } catch (err) {
      next(err)
    }
  }

  @catchError
  async getOne(req: Request, res: Response) {
    const { id } = req.params
    const cashMove = await cashMoveRepository.findOne({
      where: { id: Number(id) },
      relations: {
        category: true,
        cashAccount: true,
      },
    })
    res.json({
      data: cashMove,
    })
  }

  @catchError
  async loadFromEfisis(req: Request, res: Response) {
    const { date } = req.body
    const token: IToken = req.headers.token as safeAny
    await cashMoveService.loadFromEfisis(date, token.name)
    res.json({ message: 'informacion cargada' })
  }

  async filterCashMoves(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = req.query as {
        [key: string]: [OpFilter, ...safeAny]
      }
      const cashMoves = await cashMoveService.getFilteredNt(filters)
      response.json({ data: cashMoves })
    } catch (err) {
      next(err)
    }
  }

  async createMovement(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cashMove = req.body as CashMove
      const token: IToken = req.headers.token as safeAny
      await cashMoveService.createMovement(cashMove, token.name)
      response.status(200).json({ message: 'Movimiento creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createMovements(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { moves } = req.body as { moves: CashMove[] }
      const token: IToken = req.headers.token as safeAny
      await cashMoveService.createMovements(moves, token.name)
      response
        .status(200)
        .json({ message: 'Movimientos creados correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async updateMovement(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cashMove = req.body as CashMove
      await cashMoveService.updateMovement(cashMove)
      response
        .status(200)
        .json({ message: 'Movimiento actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async deleteMovement(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id
      const token: IToken = req.headers.token as safeAny
      await cashMoveService.deleteMovement(Number(id), token.name)
      response
        .status(200)
        .json({ message: 'Movimiento eliminado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async signMovement(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id
      const token: IToken = req.headers.token as safeAny
      await cashMoveService.signMovement(Number(id), token.name)
      response.status(200).json({ message: 'Movimiento firmado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async unsignMovement(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id
      const token: IToken = req.headers.token as safeAny
      await cashMoveService.unsignMovement(Number(id), token.name)
      response
        .status(200)
        .json({ message: 'Movimiento actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async compareBalancesEfis(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { dates } = req.query
      const result = await compareBalancesEfis.execute(
        dates as [string, string],
      )
      response.status(200).json({
        data: result,
        message: 'Movimiento actualizado correctamente',
      })
    } catch (err) {
      next(err)
    }
  }
}
