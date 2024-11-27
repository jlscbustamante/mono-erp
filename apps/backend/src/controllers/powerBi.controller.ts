import { badRequest } from '@hapi/boom'
import { NextFunction, Request, Response } from 'express'

import { MenuReport } from '../entities/MenuReport'
import reportRepository from '../repositories/report.repository'
import { PowerBIService } from '../services/PowerBi.service'
import { safeAny } from '../utils/someAny'

const powerBiService = new PowerBIService(reportRepository)

export class PowerBiController {
  async getEmbeddedToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { reportId } = req.params
      if (!reportId) throw badRequest('reportId es requerido')
      const token = await powerBiService.getEmbedInfo(reportId)

      res.json({ message: 'OK', data: token })
    } catch (err) {
      next(err)
    }
  }

  async getReports(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const device: 'mobile' | 'web' | undefined = req.query.device as safeAny
      const reports = await powerBiService.getReports(device)
      res.json({ data: reports })
    } catch (err) {
      next(err)
    }
  }

  async getInfoAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const info = await powerBiService.getInfoFree()
      res.json({ data: info })
    } catch (err) {
      next(err)
    }
  }

  async createReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { workspaceId, reportId, name } = req.body
      const report = new MenuReport()
      report.rpt_name = name
      report.key_workspc = workspaceId
      report.key_report = reportId
      await powerBiService.createReport(report)
      res.json({ message: 'Reporte creado' })
    } catch (err) {
      next(err)
    }
  }
}
