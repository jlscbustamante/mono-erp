import { NextFunction, Request, Response } from 'express'

import { Sucursal } from 'pizzadb'
import sucursalRepository from '../repositories/sucursal.repository'
import { SucursalService } from '../services/Sucursal.service'
import { EnvFilters } from '../types'

const sucursalService = new SucursalService(sucursalRepository)
export class SucursalController {
  async updateSucursalOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { sucursalId } = req.query
      const existingCategory = await sucursalRepository.findOne({
        where: {
          id: sucursalId as string,
        },
      })
      res.status(200).json(existingCategory)
    } catch (err) {
      next(err)
    }
  }

  async updateSucursal(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { sucursalId } = req.query
      const args = req.body as {
        id: string
        title: string
        ubi_address: string
        ubi_district: string
        ubi_city: string
        type_sede: string
        legalperson_name: string
        legalperson_docnum: string
        legalperson_doctype: string
        legalperson_account_bco: string
        legalperson_account_num: string
        legalperson_account_cci: string
        legalperson_account_cur: string
        legalperson_account_type: string
        status: number
      }
      const existingCategory = await sucursalRepository.findOne({
        where: {
          id: sucursalId as string,
        },
      })
      if (!existingCategory) {
        res.status(404).json({
          message: `Sucursal con ID ${req.params.sucursalId} no encontrada`,
        })

        return
      }
      await sucursalService.updateSucursal(existingCategory, args)
      res
        .status(200)
        .json({ message: 'La sucursal se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getSucursal(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listSucursal = await sucursalRepository.find()
      res.json(listSucursal)
    } catch (err) {
      next(err)
    }
  }

  async getFilterSucursal(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<Sucursal>
      const requests = await sucursalService.getFilteredSucursalNt(queries)
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async createSucursal(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        id: string
        title: string
        ubi_address: string
        ubi_district: string
        ubi_city: string
        type_sede: string
        legalperson_name: string
        legalperson_docnum: string
        legalperson_doctype: string
        legalperson_account_bco: string
        legalperson_account_num: string
        legalperson_account_cci: string
        legalperson_account_cur: string
        legalperson_account_type: string
        status: number
      }
      await sucursalService.createSucursal(args)
      res
        .status(200)
        .json({ message: 'La sucursal se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }
}
