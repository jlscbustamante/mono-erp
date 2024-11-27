export interface IReport {
  id: number
  rpt_name: string
  rpt_url: string
  rpt_token: string
  key_report: string
  show_in: number
  key_workspc: string
  priority: number
  created_at?: string
}
export interface IFilterMenuReport {
  id?: number
  rpt_name?: string
  rpt_url?: string
  rpt_token?: string
  show_in?: number
  key_report?: string
  key_workspc?: string
  priority?: number
  created_at?: string
}
export interface ICreateMenuReport extends Omit<IReport, 'id'> {
  id: any
}
