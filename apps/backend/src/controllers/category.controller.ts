import { NextFunction, Request, Response } from 'express'
import { In } from 'typeorm'

import { Account } from '../entities/Account'
import { Category } from '../entities/Category'
import { CategoryType } from '../entities/CategoryType'
import { AccountRepository } from '../repositories/account.repository'
import categoryRepository from '../repositories/category.repository'
import parameterRepository from '../repositories/parameter.repository'
import { CategoryService } from '../services/Category.service'
import { EnvFilters } from '../types'
import {
  CategoryAccountFlow,
  CategoryStatus,
  CategoryTypeMove,
} from '../types/category'
import { Filters3, IUserFilter3 } from '../types/filter'
import { safeAny } from '../utils/someAny'

const categoryService = new CategoryService(categoryRepository)

export class CategoryController {
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const args = req.body as {
        name: string
        account_id: number
        type_category_id: number
        account_flow: CategoryAccountFlow
        cash_flow: string
        codEfis: number
        type_mov: CategoryTypeMove
        roles_id: number
        m_order: number
        status: CategoryStatus
        category_type: CategoryType
        account: Account
      }
      const existingCategory = await categoryRepository.findOne({
        where: {
          id: Number(req.query.categoryId),
        },
      })
      if (!existingCategory) {
        res.status(404).json({
          message: `Categoria con ID ${req.params.cashAccountId} no encontrada`,
        })

        return
      }
      const UpdData = await categoryService.updateCategory(
        existingCategory,
        args,
      )
      res.status(200).json({
        dataTrace: UpdData,
        message: 'La category se ha actualizado correctamente',
      })
    } catch (err) {
      next(err)
    }
  }

  async getCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listCategory = await categoryRepository.find()
      res.status(200).json(listCategory)
    } catch (err) {
      next(err)
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const args = req.body as {
        name: string
        account_id: number
        m_order: number
        type_category_id: number
        account_flow: CategoryAccountFlow
        roles_id: number
        type_mov: CategoryTypeMove
        status: CategoryStatus
        category_type: CategoryType
        account: Account
        cash_flow: string
        codEfis: number
      }
      const CreateData = await categoryService.createCategory(args)
      res.status(200).json({
        dataTrace: CreateData,
        message: 'Category se ha creado correctamente',
      })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredCategory(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const queries = req.query as EnvFilters<Category>
      const queries = req.body as Filters3<Category>
      // const queries: IUserFilter3<Category> = req.body as safeAny

      // const requests = await categoryService.getFilteredTypeNt(queries)
      const { data: requests } = await categoryRepository.filter3({
        select: {
          categoryType: {
            name: true,
          },
          account: {
            account: true,
          },
        },
        filters: queries,
        relations: {
          categoryType: true,
          account: true,
        },
      })

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async getCategoryOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingCategory = await categoryRepository.findOne({
        where: {
          id: Number(req.query.categoryId),
        },
      })
      res.status(200).json(existingCategory)
    } catch (err) {
      next(err)
    }
  }

  async getAccountFather(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await parameterRepository.find({
        where: {
          type: 'ASIENTO_MULTIPLE',
        },
      })

      const valuesArray = data.map((item) => item.value)
      console.log(valuesArray)
      const existingCategory = await AccountRepository.find({
        where: {
          id: In(valuesArray.map(Number)),
        },
      })
      response.status(200).json(existingCategory)
    } catch (err: any) {
      next(err)
    }
  }
}
