import { JobLocalManagerService } from '../../../core/common/job_local_manager.service'
import { JobGroup } from '../../../core/common/types'
import { GlueService } from '../../../services/aws/glue.service'

const jobsAvailable: JobGroup[] = [
  {
    name: 'ARCHIVOS CULQI',
    jobs: [
      {
        name: 's3_rds_transacciones_culqi_pos',
      },
      {
        name: 'call_sp_transacciones_culqi_pos',
      },
      {
        name: 's3_purge_folder_culqi_pos',
      },
    ],
  },
  {
    name: 'ARCHIVOS IZIPAY-TODOS',
    jobs: [
      {
        name: 's3_rds_transacciones_izipay_pos',
      },
      {
        name: 'call_sp_transacciones_izipay_pos',
      },
      {
        name: 's3_purge_folder_izipay_pos',
      },
    ],
  },
  {
    name: 'ARCHIVOS AMEX',
    jobs: [
      {
        name: 's3_rds_transacciones_iziamx_pos',
      },
      {
        name: 'call_sp_transacciones_izipay_pos',
      },
      {
        name: 's3_purge_folder_iziamx_pos',
      },
    ],
  },
  {
    name: 'ARCHIVOS DC',
    jobs: [
      {
        name: 's3_rds_transacciones_izidc_pos',
      },
      {
        name: 'call_sp_transacciones_izipay_pos',
      },
      {
        name: 's3_purge_folder_izidc_pos',
      },
    ],
  },
  {
    name: 'ARCHIVOS MC',
    jobs: [
      {
        name: 's3_rds_transacciones_izimc_pos',
      },
      {
        name: 'call_sp_transacciones_izipay_pos',
      },
      {
        name: 's3_purge_folder_izimc_pos',
      },
    ],
  },
]

const jobManager = new JobLocalManagerService()

export class MovementService {
  constructor(private readonly glueService: GlueService) {}
  async getInfoJob(jobName: string) {
    return this.glueService.infoJob(jobName)
  }

  async getInfoJobStatus(jobName: string, jobRunId: string) {
    return this.glueService.getJobStatus(jobName, jobRunId)
  }

  async getJobs() {
    const groups = jobsAvailable.map((el) => el.name)
    return groups
  }

  async listJobs() {
    return this.glueService.listJobs()
  }

  async startRun() {
    await jobManager.runGroups(jobsAvailable)
  }

  async clearJobs() {
    jobManager.clear()
  }

  async getStatusRunJobs() {
    return jobManager.getLogs()
  }

  async getGroupsJob() {
    return jobManager.getGroups()
  }
}
