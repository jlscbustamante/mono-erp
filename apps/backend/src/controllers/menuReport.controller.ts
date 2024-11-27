import { NextFunction, Request, Response } from 'express'

import { MenuReport } from '../entities/MenuReport'
import reportRepository from '../repositories/report.repository'
import { MenuReportService } from '../services/MenuReport.service'
import { EnvFilters } from '../types'

const menuReportService = new MenuReportService(reportRepository)
export class MenuReportController {
  async updateMenuReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        rpt_name: string
        key_report: string
        key_workspc: string
        rpt_url: string
        show_in: number
        rpt_token: string
        priority: number
      }
      const existingMenuReport = await reportRepository.findOne({
        where: {
          id: Number(req.query.menuReportId),
        },
      })
      if (!existingMenuReport) {
        res.status(404).json({
          message: `Menu Report con ID ${req.params.menuReportId} no encontrada`,
        })

        return
      }
      await menuReportService.updateMenuReport(existingMenuReport, args)
      res
        .status(200)
        .json({ message: 'Menu Report  se ha actualizado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getMenuReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listMenuReport = await reportRepository.find()
      res.status(200).json(listMenuReport)
    } catch (err) {
      next(err)
    }
  }

  async createMenuReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const args = req.body as {
        rpt_name: string
        key_report: string
        key_workspc: string
        rpt_url: string
        show_in: number
        rpt_token: string
        priority: number
      }

      await menuReportService.createMenuReport(args)
      res
        .status(200)
        .json({ message: 'Menu Report se ha creado correctamente' })
    } catch (err) {
      next(err)
    }
  }

  async getMenuReportOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const existingMenuReport = await reportRepository.findOne({
        where: {
          id: Number(req.query.menuReportId),
        },
      })
      if (!existingMenuReport) {
        res.status(404).json({
          message: `Menu Report con ID ${req.params.menuReportId} no encontrada`,
        })

        return
      }
      res.status(200).json(existingMenuReport)
    } catch (err) {
      next(err)
    }
  }

  async getFilterMenuReport(
    req: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queries = req.query as EnvFilters<MenuReport>
      const requests = await menuReportService.getFilterMenuReportNt(queries)
      response.json(requests)
    } catch (err) {
      next(err)
    }
  }
}
