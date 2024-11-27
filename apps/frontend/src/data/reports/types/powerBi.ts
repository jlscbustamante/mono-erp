export interface IPBIReport {
  accessToken: string
  expiry: string
  status: number
  embedUrl: { reportId: string; reportName: string; embedUrl: string }[]
}
