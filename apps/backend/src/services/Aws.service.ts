import {
  GetJobRunCommand,
  GetJobsCommand,
  GlueClient,
  StartJobRunCommand,
} from '@aws-sdk/client-glue'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import config from '../config/config'

export class AwsService {
  client: S3Client
  clientMetodoPago: S3Client
  private basicConfig: {
    region: string
    credentials: { accessKeyId: string; secretAccessKey: string }
  }
  constructor() {
    this.basicConfig = {
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey,
      },
    }
    this.client = new S3Client({
      region: config.s3Region,
      credentials: {
        accessKeyId: config.s3AccessKey,
        secretAccessKey: config.s3SecretKey,
      },
    })

    this.clientMetodoPago = new S3Client({
      region: config.s3RegionPagos,
      credentials: {
        accessKeyId: config.s3AccessKeyPagos,
        secretAccessKey: config.s3SecretKeyPagos,
      },
    })
  }

  async uploadFile(file: Express.Multer.File, pathFile: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.s3Bucket,
      Key: pathFile,
      Body: file.buffer,
    })
    await this.client.send(command)
  }

  //File subidos para bcp
  async uploadFileBPC(
    file: Express.Multer.File | string,
    pathFile: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketNamePayments,
      Key: pathFile,
      Body: typeof file === 'string' ? file : file.buffer,
    })

    await this.clientMetodoPago.send(command)
  }

  //File subidos para IziPay
  async uploadFileIziPay(
    file: Express.Multer.File | string,
    pathFile: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketNamePayments,
      Key: pathFile,
      Body: typeof file === 'string' ? file : file.buffer,
    })
    await this.clientMetodoPago.send(command)
  }

  //File subidos para culqi
  async uploadFileCulqiOne(
    file: Express.Multer.File | string,
    pathFile: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketNamePayments,
      Key: pathFile,
      Body: typeof file === 'string' ? file : file.buffer,
    })
    await this.clientMetodoPago.send(command)
  }

  //File subidos para culqi
  async uploadFileCulqiTwo(
    file: Express.Multer.File | string,
    pathFile: string,
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketNamePayments,
      Key: pathFile,
      Body: typeof file === 'string' ? file : file.buffer,
    })
    await this.clientMetodoPago.send(command)
  }

  async createPresigedUrl(pathname: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: config.s3Bucket,
      Key: pathname,
    })
    const durationInSeconds = 180
    const url = await getSignedUrl(this.client, command, {
      expiresIn: durationInSeconds,
    })

    return url
  }

  async uploadFilePaymentMethods(
    file: Express.Multer.File | string,
    pathFile: string,
  ) {
    const command = new PutObjectCommand({
      Bucket: config.s3BucketNamePayments,
      Key: pathFile,
      Body: typeof file === 'string' ? file : file.buffer,
    })
    await this.clientMetodoPago.send(command)
  }

  async startJob(jobName: string) {
    const glueClient = new GlueClient(this.basicConfig)
    const startJobRunCommand = new StartJobRunCommand({ JobName: jobName })
    const response = (await glueClient.send(startJobRunCommand)) as unknown as {
      $metadata: {
        httpStatusCode: number
        requestId: string
        attempts: number
        totalRetryDelay: number
      }
      JobRunId: string
    }
    return response.JobRunId
  }

  async listJobs() {
    const glueClient = new GlueClient(this.basicConfig)
    const getJobsCommand = new GetJobsCommand({})
    const response = await glueClient.send(getJobsCommand)
    return response
  }

  async verifyStatusJob(name: string, jobId: string) {
    const glueClient = new GlueClient(this.basicConfig)
    const getJobRunCommand = new GetJobRunCommand({
      JobName: name,
      RunId: jobId,
    })
    const response = (await glueClient.send(getJobRunCommand)) as unknown as {
      JobRun: {
        AllocatedCapacity: number
        Attempt: number
        CompletedOn: string
        ErrorMessage: string
        ExecutionClass: string
        ExecutionTime: number
        GlueVersion: string
        Id: string
        JobName: string
        JobRunState: 'FAILED' | 'RUNNING' | 'SUCCEEDED'
        LastModifiedOn: string
        LogGroupName: string
        MaxCapacity: number
        NumberOfWorkers: number
        PredecessorRuns: any[]
        StartedOn: string
        Timeout: number
        WorkerType: string
      }
    }
    return {
      status: response.JobRun.JobRunState,
      errorMessage: response.JobRun.ErrorMessage,
    }
  }
}
