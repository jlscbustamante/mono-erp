import {
  GetJobCommand,
  GetJobRunCommand,
  GlueClient,
  ListJobsCommand,
  StartJobRunCommand,
} from '@aws-sdk/client-glue'

import config from '../../config/config'

export class GlueService {
  private readonly client = new GlueClient({
    region: config.aws.glue.region,
    credentials: {
      accessKeyId: config.aws.glue.accessKey,
      secretAccessKey: config.aws.glue.secretKey,
    },
  })
  constructor() {}

  async infoJob(jobName: string) {
    const command = new GetJobCommand({ JobName: jobName })
    const response = await this.client.send(command)

    return response.Job
  }

  async listJobs() {
    const command = new ListJobsCommand({})
    const response = await this.client.send(command)
    return response.JobNames
  }

  async startJob(jobName: string) {
    const command = new StartJobRunCommand({ JobName: jobName })
    const response = await this.client.send(command)
    return response.JobRunId
  }

  async getJobStatus(jobName: string, jobRunId: string) {
    const command = new GetJobRunCommand({
      JobName: jobName,
      RunId: jobRunId,
    })
    const response = await this.client.send(command)
    return response.JobRun
  }
}

/**
 * STATUS RESPONSE
 *
 *{
  "data": {
    "AllocatedCapacity": 10,
    "Attempt": 0,
    "ExecutionClass": "STANDARD",
    "ExecutionTime": 27,
    "GlueVersion": "4.0",
    "Id": "jr_b4a2515fad781325468f4af1263a2781a99e47b1833182731f458c11170a71d9",
    "JobName": "s3_rds_transacciones_izimc_pos",
    "JobRunState": "RUNNING", // SUCCEEDED
    "LastModifiedOn": "2024-10-02T17:23:36.623Z",
    "LogGroupName": "/aws-glue/jobs",
    "MaxCapacity": 10,
    "NumberOfWorkers": 10,
    "PredecessorRuns": [],
    "StartedOn": "2024-10-02T17:23:32.703Z",
    "Timeout": 2880,
    "WorkerType": "G.1X"
  }
}
 *
 */
