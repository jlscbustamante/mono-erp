import { Request, Response } from 'express'
import { In } from 'typeorm'

import { Category } from '../entities/Category'
import cashAccountRepository from '../repositories/cashAccount.repository'
import cashMoveRepository from '../repositories/cashMove.repository'
import categoryRepository from '../repositories/category.repository'
import extPagosCulqiRepository from '../repositories/store/ExtPagosCulqi.repository'
import extPagosIzipayRepository from '../repositories/store/ExtPagosIzipay.repository'
import { PaymentMethodsService } from '../services/store/PaymentMethods.service'
import { IToken } from '../types'
import { CashAccountStatus, CashAccountTypeId } from '../types/cashAccount'
import { CategoryStatus, CategoryTypeId } from '../types/category'
import { catchError } from '../utils/decorators'
import { safeAny } from '../utils/someAny'

const paymentMethodsService = new PaymentMethodsService(
  extPagosCulqiRepository,
  extPagosIzipayRepository,
  cashMoveRepository,
)

export class StoreController {
  @catchError
  async getInfoPaymentMethods(req: Request, res: Response): Promise<void> {
    const { date, exclude } = req.query
    const excludeStatus =
      exclude && (exclude as string[]).length > 0
        ? (exclude as string[])
        : undefined
    const result = await paymentMethodsService.getInfoPaymentMethods(
      date as string,
      excludeStatus,
    )
    res.json({
      data: result,
    })
  }

  @catchError
  async getTransactionsByMethod(req: Request, res: Response): Promise<void> {
    const { sucursalcode, date, method, exclude } = req.query
    const excludeStatus =
      exclude && (exclude as string[]).length > 0
        ? (exclude as string[])
        : undefined
    const result = await paymentMethodsService.getTransactionsByMethod(
      sucursalcode as string,
      date as string,
      method as 'online' | 'izipay' | 'culqi',
      excludeStatus,
    )
    res.json({
      data: result,
    })
  }

  @catchError
  async getAmountByPos(req: Request, res: Response): Promise<void> {
    const { sucursalcode, date, exclude } = req.query
    const excludeStatus =
      exclude && (exclude as string[]).length > 0
        ? (exclude as string[])
        : undefined
    const infoTerminal = await paymentMethodsService.infoTerminal(
      sucursalcode as string,
      date as string,
      excludeStatus,
    )

    res.json({
      data: infoTerminal,
    })
  }

  @catchError
  async getCategories(req: Request, response: Response): Promise<void> {
    const categories = await categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([
            CategoryTypeId.Bank,
            CategoryTypeId.Standard,
            CategoryTypeId.Store,
            CategoryTypeId.Multiple,
          ]),
        },
      },
      order: {
        name: 'ASC',
      },
    })
    response.json({ data: categories })
  }

  async getCategoriesByStore(req: Request, response: Response): Promise<void> {
    const categories = await categoryRepository.find({
      where: {
        status: CategoryStatus.Active,
        categoryType: {
          type_id: In([CategoryTypeId.Store]),
        },
      },
      order: {
        name: 'ASC',
      },
    })

    const categoriesUnique = categories.reduce((acc, category) => {
      if (!acc.find((cat) => cat.name === category.name)) {
        acc.push(category)
      }
      return acc
    }, [] as Category[])

    response.json({ data: categoriesUnique })
  }

  async getCashAccounts(req: Request, response: Response): Promise<void> {
    const cashAccounts = await cashAccountRepository.find({
      where: {
        status: CashAccountStatus.Active,
        cash_account_type: {
          type_id: In([CashAccountTypeId.Store]),
        },
      },
      order: {
        name: 'ASC',
      },
      relations: { cash_account_type: true },
    })
    response.json({ data: cashAccounts })
  }

  @catchError
  async signReconciliation(req: Request, res: Response): Promise<void> {
    const token: IToken = req.headers.token as safeAny
    const {
      cashId,
      date,
      sucursalCode,
      izipayAmount,
      culqiAmount,
      onlineAmount,
    } = req.body
    await paymentMethodsService.signReconciliation({
      cashId: Number(cashId),
      date: date,
      user: token.name,
      sucursalCode,
      izipayAmount,
      culqiAmount,
      onlineAmount,
    })
    res.json({ message: 'Firma realizada' })
  }
}
