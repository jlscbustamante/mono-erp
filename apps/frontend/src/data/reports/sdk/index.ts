import { baseUrl } from '@/data/api/baseUrl'

import { IPBIReport, IReport } from '../types'

export const reports = async () => {
  return baseUrl<IReport[]>('reports?device=web')
}

export const reportEmbed = async (id: number, token?: string) => {
  return baseUrl<IPBIReport>(`reports/get-token/${id}`, { token })
}

export const addReport = async (report: {
  name: string
  workspaceId: string
  reportId: string
}) => {
  return baseUrl<IReport>('reports/create', {
    method: 'POST',
    body: report,
  })
}
