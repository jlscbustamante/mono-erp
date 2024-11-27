import { MenuReport } from '../entities/MenuReport'
import { ReportRepository } from '../repositories/report.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditMenuReport = {
  rpt_name: string
  key_report: string
  key_workspc: string
  rpt_url: string
  rpt_token: string
  priority: number
  show_in: number
}
export class MenuReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async updateMenuReport(
    existingMenuReport: MenuReport,
    args: EditMenuReport,
  ): Promise<void> {
    try {
      existingMenuReport.rpt_name = args.rpt_name
      existingMenuReport.rpt_token = args.rpt_token
      existingMenuReport.rpt_url = args.rpt_url
      existingMenuReport.show_in = args.show_in
      existingMenuReport.key_report = args.key_report
      existingMenuReport.key_workspc = args.key_workspc
      existingMenuReport.priority = args.priority
      existingMenuReport.updated_at = dateNow()
      await this.reportRepository.save(existingMenuReport)
    } catch (error: any) {
      throw new Error(`Error al actualizar el Menu Report : ${error}`)
    }
  }

  async getFilterMenuReportNt(
    filters: EnvFilters<MenuReport>,
  ): Promise<MenuReport[]> {
    return this.reportRepository.filterNt(filters)
  }

  async createMenuReport(args: EditMenuReport): Promise<void> {
    const newMenuReport = new MenuReport()
    try {
      newMenuReport.rpt_name = args.rpt_name
      newMenuReport.key_report = args.key_report
      newMenuReport.key_workspc = args.key_workspc
      newMenuReport.rpt_url = args.rpt_url
      newMenuReport.show_in = args.show_in
      newMenuReport.rpt_token = args.rpt_token
      newMenuReport.priority = args.priority
      newMenuReport.created_at = dateNow()
      newMenuReport.updated_at = dateNow()
      await this.reportRepository.save(newMenuReport)
    } catch (error: any) {
      throw new Error(`Error al crear el Menu Report : ${error}`)
    }
  }
}
