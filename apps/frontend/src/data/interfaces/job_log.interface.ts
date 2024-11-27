export interface JobLog {
  date: Date
  groupName: string
  closed: boolean
  jobs: {
    isInfo: boolean
    start: Date
    name: string
    ok: boolean
    time: number
    runId: string
    error: string
  }[]
}
