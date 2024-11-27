import { NextFunction, Request, Response } from 'express'

import { CategoryType } from '../entities/CategoryType'
import categoryTypeRepository from '../repositories/categoryType.repository'
import { CategoryTypeService } from '../services/CategoryType.service'
import { EnvFilters } from '../types'
import { CategoryTypeId } from '../types/category'

const categoryService = new CategoryTypeService(categoryTypeRepository)

export class CategoryTypeController {
  async updateTypeCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        type_id: CategoryTypeId
        status: 'A' | 'E'
      }
      const existingCategoryType = await categoryTypeRepository.findOne({
        where: {
          id: Number(req.query.categoryTypeId),
        },
      })
      if (!existingCategoryType) {
        res.status(404).json({
          message: `Type de Categoria con ID ${req.params.cashAccountId} no encontrada`,
        })

        return
      }
      await categoryService.updateCategory(existingCategoryType, args)
      res
        .status(200)
        .json({ message: 'Type Category se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getTypeCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listTypeCategory = await categoryTypeRepository.find()
      res.status(200).json(listTypeCategory)
    } catch (err) {
      next(err)
    }
  }

  async createTypeCategory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        type_id: CategoryTypeId
        status: 'A' | 'E'
      }
      await categoryService.createCategoryType(args)
      res
        .status(200)
        .json({ message: 'CategoryType se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getTypeCategoryOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingCategoryType = await categoryTypeRepository.findOne({
        where: {
          id: Number(req.query.categoryTypeId),
        },
      })
      res.status(200).json(existingCategoryType)
    } catch (err) {
      next(err)
    }
  }

  async getFilterCategoryType(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<CategoryType>
      const requests = await categoryService.getFilteredCategoryTypeNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
