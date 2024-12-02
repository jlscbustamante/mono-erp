import { NextFunction, Request, Response } from 'express'

import { IamFunction, IamRole } from 'pizzadb'
import IamFunctionRepository from '../repositories/iamFuction.repository'
import IamRoleRepository from '../repositories/IamRole.repository'
import { IamRoleService } from '../services/IamRole.service'
import { IamUserRoles } from '../services/IamUserRoles.service'
import { EnvFilters } from '../types'

const iamUserRolesService = new IamUserRoles()
const iamRoleService = new IamRoleService(IamRoleRepository)
export class IamRoleController {
  async getIamRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listIamRole = await IamRoleRepository.find()
      res.status(200).json(listIamRole)
    } catch (err) {
      next(err)
    }
  }

  async getIamRoleOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamRole = await IamRoleRepository.findOne({
        where: {
          id: Number(req.query.iamRoleId),
        },
      })
      res.status(200).json(existingIamRole)
    } catch (err) {
      next(err)
    }
  }

  async updateIamRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingIamRole = await IamRoleRepository.findOne({
        where: {
          id: Number(req.query.iamRoleId),
        },
      })
      if (!existingIamRole) {
        res.status(404).json({
          message: `IamRole con ID ${req.params.iamRoleId} no encontrada`,
        })

        return
      }

      const a = await iamUserRolesService.permission(
        String(req.query.iamRoleId),
      )
      res.status(200).json({ a })
    } catch (err) {
      next(err)
    }
  }

  async updateIamRoleStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as { name: string; status: number }
      const existingIamRole = await IamRoleRepository.findOne({
        where: {
          id: Number(req.query.iamRoleId),
        },
      })
      if (!existingIamRole) {
        res.status(404).json({
          message: `Role con ID ${req.params.iamRoleId} no encontrada`,
        })

        return
      }

      await iamRoleService.updateIamRole(existingIamRole, args)
      res.status(200).json({ message: 'Rol se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async createIamRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        name: string
        status: number
      }
      await iamRoleService.createIamRole(args)
      res.status(200).json({ message: 'IamRole se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilteredIamRoleNt(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<IamRole>
      const requests = await iamRoleService.getFilteredIamRoleNt(queries)

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
  async groupFunctions(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const moduleId = req.query.moduleId as string | undefined

      if (moduleId !== undefined) {
        try {
          const funciones: IamFunction[] = await IamFunctionRepository.find()
          const pathFunctionsSet = new Set<string>()

          funciones.forEach((funcion: IamFunction) => {
            if (funcion.module_id.toString() === moduleId) {
              pathFunctionsSet.add(funcion.path_function)
            }
          })

          const pathFunctionsArray = Array.from(pathFunctionsSet)

          const pathFunctionObjects = pathFunctionsArray.map(
            (pathFunction: string) => {
              return {
                path_function: pathFunction,
                priority: funciones.find(
                  (funcion) =>
                    funcion.path_function === pathFunction &&
                    funcion.module_id.toString() === moduleId,
                )?.priority,
              }
            },
          )

          const sortedPathFunctionObjects = pathFunctionObjects.sort(
            (a, b) => (a.priority || 0) - (b.priority || 0),
          )

          const sortedPathFunctionsArray = sortedPathFunctionObjects.map(
            (pathFunctionObject) => pathFunctionObject.path_function,
          )

          const result = {
            pathFunctionsArray: sortedPathFunctionsArray,
          }

          response.json(result)
        } catch (error) {
          console.error(error)
          response.json({ error: 'Error al obtener funciones' })
        }
      } else {
        response.json({ error: 'Error: moduleId no proporcionado' })
      }
    } catch (err) {
      next(err)
    }
  }
}
