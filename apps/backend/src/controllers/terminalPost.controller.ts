import { NextFunction, Request, Response } from 'express'

import { TerminalPost } from '../entities/TerminalPost'
import terminalPostRepository from '../repositories/terminalPost.repository'
import { TerminalPostService } from '../services/TerminalPost.service'
import { EnvFilters } from '../types'
import { Filters3 } from '../types/filter'

const terminalPostService = new TerminalPostService(terminalPostRepository)

export class TerminalPostController {
  async updateTerminalPost(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        terminal: string
        sucursal_id: string
        supplier: string
        status: number
      }
      const existingTerminalPost = await terminalPostRepository.findOne({
        where: {
          id: Number(req.query.terminalPostId),
        },
      })
      if (!existingTerminalPost) {
        res.status(404).json({
          message: `Terminal Post con ID ${req.params.terminalPostId} no encontrada`,
        })

        return
      }

      const queryExec = await terminalPostService.updateTerminalPost(
        existingTerminalPost,
        args,
      )

      console.log('Datos de ejecucion de la consulta:')
      console.dir(queryExec)
      //console.log('Datos de la res:')
      //console.dir(res)

      res
        .status(200)
        .json({ message: 'Terminal Post se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getTerminalPost(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const queries = req.query as EnvFilters<Category>
      const queries = req.body as Filters3<TerminalPost>
      console.log('queries', queries)
      // const queries: IUserFilter3<Category> = req.body as safeAny

      // const requests = await categoryService.getFilteredTypeNt(queries)
      const { data: requests } = await terminalPostRepository.filter3({
        select: {
          sucursal: {
            title: true,
          },
        },
        filters: queries,
        relations: {
          sucursal: true,
        },
      })

      response.json(requests)
    } catch (err) {
      next(err)
    }
  }

  async createTerminalPost(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        terminal: string
        sucursal_id: string
        supplier: string
        status: number
      }

      await terminalPostService.createTerminalPost(args)
      res
        .status(200)
        .json({ message: 'El terminalPost se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getFilterTerminalPost(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const queries = req.query as EnvFilters<Category>
      // const queries = req.body as Filters3<TerminalPost>
      // ?sucursal_id=3
      // {sucursal_id:3}
      const queries = req.query as EnvFilters<TerminalPost>
      // const queries: IUserFilter3<Category> = req.body as safeAny
      //1console.log('queries', queries)
      // const requests = await categoryService.getFilteredTypeNt(queries)
      const { data: requests } = await terminalPostRepository.filter3({
        select: {
          sucursal: {
            title: true,
          },
        },
        filters: queries,
        relations: {
          sucursal: true,
        },
      })
      //1console.log('requests', requests)
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
