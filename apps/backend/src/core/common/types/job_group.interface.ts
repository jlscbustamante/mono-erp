import { AppJob } from './job.interface'

export interface JobGroup {
  name: string
  jobs: AppJob[]
}
