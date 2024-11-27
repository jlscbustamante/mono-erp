import { NextFunction, Request, Response } from 'express'

import { IamPermission } from '../entities/IamPermission'
import iamPermissionRepository from '../repositories/iamPermission.repository'
import { IamPermissionService } from '../services/IamPermission.service'
import { EnvFilters } from '../types'

const iamPermissionService = new IamPermissionService(iamPermissionRepository)
export class IamPermissionController {
  async getIamPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listPermission = await iamPermissionRepository.find()
      res.status(200).json(listPermission)
    } catch (err) {
      next(err)
    }
  }

  async getIamPermissionOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamPermission = await iamPermissionRepository.findOne({
        where: {
          id: Number(req.query.iamPermissionId),
        },
      })
      res.status(200).json(existingIamPermission)
    } catch (err) {
      next(err)
    }
  }

  async updateIamPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        rol_id: number
        module_id: number
        function_id: number
        granted: number
      }
      const existingIamLog = await iamPermissionRepository.findOne({
        where: {
          id: Number(req.query.iamPermissionId),
        },
      })
      if (!existingIamLog) {
        res.status(404).json({
          message: `IamPermission con ID ${req.params.iamPermissionId} no encontrada`,
        })

        return
      }

      await iamPermissionService.updateIamPermission(existingIamLog, args)
      res
        .status(200)
        .json({ message: 'IamPermission se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamPermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        rol_id: number
        module_id: number
        function_id: number
        granted: number
      }[]
      await iamPermissionService.createIamPermission(args)
      res
        .status(200)
        .json({ message: 'IamPermission se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamPermissionNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamPermission>
      const requests = await iamPermissionService.getFilteredIamLogNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async deleteIamPermission(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.query.rol_id) {
        response.status(400).json({ error: 'Se requiere el parámetro rol_id' })
      }

      await iamPermissionService.deleteIamPermissionsByRolId(
        String(req.query.rol_id),
      )

      response.json({ message: 'Registros eliminados exitosamente' })
    } catch (err) {
      next(err)
    }
  }
}
