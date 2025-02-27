import { baseUrl } from '@/data/api/baseUrl'
import { JobLog } from '@/data/interfaces'

export const getAvailableJobs = async (): Promise<string[]> => {
  return baseUrl<string[]>('hex/movements/job/available', {
    method: 'GET',
  })
}

export const getLogJobs = async (): Promise<JobLog[]> => {
  return baseUrl<JobLog[]>('hex/movements/job/run/status', {
    method: 'GET',
  })
}

export const runJobs = async (): Promise<void> => {
  return baseUrl<void>('hex/movements/job/run', {
    method: 'POST',
  })
}

export const runJobGroup = async (name: string): Promise<void> => {
  return baseUrl<void>('hex/movements/job/run-group', {
    method: 'POST',
    body: {
      group: name,
    },
  })
}

export const clearLogsJob = async (): Promise<void> => {
  return baseUrl<void>('hex/movements/job/clear')
}

export const resetStoreData = async (data: {
  cashId: number
  date: string
}) => {
  return baseUrl<void>('store/pos/resetData', {
    method: 'POST',
    body: data,
  })
}
