import { NextFunction, Request, Response } from 'express'

import { Supplier } from '../entities/Supplier'
import { invSupplierRepository } from '../repositories/inventory/supplier.repository'
import supplierRepository from '../repositories/supplier.repository'
import { SupplierService } from '../services/Supplier.service'
import { EnvFilters } from '../types'

const supplierService = new SupplierService(supplierRepository)

export class SupplierController {
  async updateSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        supplier: string
        legal_name: string
        legal_number: string
        address: string
        legal_account_bco: string
        legal_account_num: string
        legal_account_cci: string
        legal_account_cur: string
        legal_account_type: string
        status: boolean
      }
      const existingSupplier = await supplierRepository.findOne({
        where: {
          id: Number(req.query.supplierId),
        },
      })
      if (!existingSupplier) {
        res.status(404).json({
          message: `Supplier con ID ${req.params.supplierId} no encontrada`,
        })

        return
      }
      await supplierService.updateSupplier(existingSupplier, args)
      res
        .status(200)
        .json({ message: 'Supplier se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listSupplier = await invSupplierRepository.find({
        order: { supplier: 'ASC' },
      })
      res.status(200).json(listSupplier)
    } catch (err) {
      next(err)
    }
  }

  async getSupplierOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingSupplier = await supplierRepository.findOne({
        where: {
          id: Number(req.query.supplierId),
        },
      })
      res.status(200).json(existingSupplier)
    } catch (err) {
      next(err)
    }
  }

  async createSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        supplier: string
        legal_name: string
        legal_number: string
        address: string
        legal_account_bco: string
        legal_account_num: string
        legal_account_cci: string
        legal_account_cur: string
        legal_account_type: string
        status: boolean
      }
      await supplierService.createSupplier(args)
      res.status(200).json({ message: 'Supplier se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilterSupplier(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<Supplier>
      const requests = await supplierService.getFilteredSupplierNt(queries)
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
