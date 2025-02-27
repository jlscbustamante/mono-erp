import { AppDataSource } from '../../config/database'
import { GlueService } from '../../services/aws/glue.service'
import { JobGroup } from './types'

interface JobLog {
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

export class JobLocalManagerService extends GlueService {
  private logs: JobLog[] = []
  private jobGroups: JobGroup[] = [
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
  private intervalId: NodeJS.Timeout | null = null

  constructor(private readonly segs = 30) {
    super()
  }

  async runGroups(groups: JobGroup[]) {
    if (this.isRunning()) {
      throw new Error('Ya hay un proceso en ejecución, espere a finalizarlo.')
    }
    if (groups.length == 0) return
    this.logs = []
    this.jobGroups = groups
    await this.startGroup(this.jobGroups[0].name)
    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        await this.checkStatus()
      }, this.segs * 1000)
    }
  }

  private async getCountFileIzipay() {
    try {
      const files = await AppDataSource.query(
        'SELECT COUNT(*) as count FROM ext_pagos_izipay',
      )
      const count = Number(files[0]?.count ?? 0)
      return count
    } catch (err) {
      return 0
    }
  }
  private async getCountFileCulqi() {
    try {
      const files = await AppDataSource.query(
        'SELECT COUNT(*) as count FROM ext_pagos_culqi',
      )
      const count = Number(files[0]?.count ?? 0)
      return count
    } catch (err) {
      return 0
    }
  }

  async stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  async startGroup(groupName: string) {
    const group = this.validateJob(groupName)
    if (!group) throw new Error('No se pudo encontrar el grupo de jobs')

    const existInLog = this.logs.find((g) => g.groupName === group.name)

    if (existInLog && !existInLog.closed) {
      throw new Error('Ya existe un proceso en ejecución para este grupo')
    }
    this.logs = this.logs.filter((g) => g.groupName !== group.name)

    const firstJobId = await this.startJob(group.jobs[0].name)
    let files = 0
    if (isIzipay(groupName)) {
      files = await this.getCountFileIzipay()
    } else {
      files = await this.getCountFileCulqi()
    }

    this.logs.push({
      date: new Date(),
      groupName: group.name,
      closed: firstJobId ? false : true,
      jobs: [
        {
          isInfo: true,
          start: new Date(),
          name: `Cantidad de archivos antes del proceso : ${files}`,
          ok: true,
          time: 0,
          runId: '',
          error: '',
        },
        {
          isInfo: false,
          start: new Date(),
          name: group.jobs[0].name,
          ok: !!firstJobId,
          time: 0,
          runId: firstJobId ?? '',
          error: firstJobId ? '' : 'No se puedo iniciar el job',
        },
      ],
    })

    if (!this.intervalId) {
      this.intervalId = setInterval(async () => {
        await this.checkAllStatus()
      }, this.segs * 1000)
    }
  }

  async checkAllStatus() {
    for (const group of this.logs) {
      await this.checkOneGroupLog(group)
    }
    if (
      this.logs.every((groupLog) => {
        return groupLog.closed
      })
    ) {
      this.stopInterval()
    }
  }

  private async checkStatus() {
    try {
      await this.checkOneGroupLog(this.logs[this.logs.length - 1])
      // const lastGroup = this.logs[this.logs.length - 1]
      const haveError = this.logs.some(
        (g) => g.closed && g.jobs.some((j) => !j.ok),
      )

      if (haveError) {
        this.stopInterval()
      }
      // else if (lastGroup.closed) {
      //   const indexGroup = this.jobGroups.findIndex(
      //     (g) => g.name === lastGroup.groupName,
      //   )
      //   if (indexGroup > -1) {
      //     const nextGroup = this.jobGroups[indexGroup + 1]
      //     if (nextGroup) {
      //       await this.startGroup(nextGroup.name)
      //     }
      //   } else {
      //     this.stopInterval()
      //   }
      // }
    } catch (err: any) {
      const lastGroup = this.logs[this.logs.length - 1]
      lastGroup.jobs[lastGroup.jobs.length - 1].error =
        err?.message ?? 'Internal error on job manager'
      this.stopInterval()
    }
    if (this.logs.every((l) => l.closed)) this.stopInterval()
  }

  clear() {
    this.logs = this.logs.filter((el) => !el.closed)
    // if (this.isRunning())
    //   throw new Error(
    //     'No se puede limpiar el registro, hay un proceso en ejecución.',
    //   )
    // this.jobGroups = []
    // this.logs = []
  }

  getLogs() {
    const lastGroup = this.logs.filter((g) => !g.closed)[this.logs.length - 1]
    if (!lastGroup) return this.logs
    const lastJob = lastGroup.jobs[lastGroup.jobs.length - 1]
    const diffTime = this.getDiffTime(lastJob.start)
    return this.logs.map((g) => {
      if (g.groupName == lastGroup.groupName) {
        g.jobs = g.jobs.map((j) => {
          if (j.name == lastJob.name) {
            j.time = diffTime
          }
          return j
        })
        return g
      }
      return g
    })
  }

  private async checkOneGroupLog(group: JobLog) {
    if (group.closed) return
    const lastJob = group.jobs[group.jobs.length - 1]
    const time = this.getDiffTime(lastJob.start)
    const statusJob = await this.getJobStatus(lastJob.name, lastJob.runId)

    if (statusJob?.JobRunState == 'RUNNING') {
      this.logs = this.logs.map((gr) => {
        if (gr.groupName === group.groupName) {
          gr.jobs = gr.jobs.map((j) => {
            if (j.name === lastJob.name) {
              j.ok = true
              j.time = time
            }
            return j
          })
        }
        return gr
      })
    } else if (statusJob?.JobRunState == 'FAILED') {
      this.logs = this.logs.map((gr) => {
        if (gr.groupName === group.groupName) {
          gr.closed = true
          gr.jobs = gr.jobs.map((j) => {
            if (j.name === lastJob.name) {
              j.ok = false
              j.time = time
              j.error =
                statusJob?.ErrorMessage ??
                'Error desconocido al ejecutar el job'
            }
            return j
          })
        }
        return gr
      })
    } else if (statusJob?.JobRunState === 'SUCCEEDED') {
      const nextJob = this.getNextJob(group.groupName, lastJob.name)
      const diffTime =
        statusJob.StartedOn && statusJob.CompletedOn
          ? this.getDiffTimeInSeconds(
              statusJob.StartedOn,
              statusJob.CompletedOn,
            )
          : time
      this.logs = this.logs.map((gr) => {
        if (gr.groupName === group.groupName) {
          if (!nextJob) gr.closed = true
          gr.jobs = gr.jobs.map((j) => {
            if (j.name === lastJob.name) {
              j.ok = true
              j.time = diffTime
            }
            return j
          })
        }
        return gr
      })
      // start next
      if (nextJob) {
        const nextJobId = await this.startJob(nextJob.name)
        if (!nextJobId)
          throw new Error(`No se pudo iniciar el job ${nextJob.name}`)

        this.logs = this.logs.map((gr) => {
          if (gr.groupName === group.groupName) {
            gr.jobs.push({
              isInfo: false,
              start: new Date(),
              name: nextJob.name,
              ok: true,
              time: 0,
              runId: nextJobId,
              error: '',
            })
          }
          return gr
        })
      } else {
        let files = 0
        if (isIzipay(group.groupName)) {
          files = await this.getCountFileIzipay()
        } else {
          files = await this.getCountFileCulqi()
        }
        this.logs = this.logs.map((gr) => {
          if (gr.groupName === group.groupName) {
            gr.jobs.push({
              isInfo: true,
              start: new Date(),
              name: `Cantidad de archivos después del proceso : ${files}`,
              ok: true,
              time: 0,
              runId: '',
              error: '',
            })
          }
          return gr
        })
      }
    }
  }

  private getDiffTime(date: Date) {
    const diff = new Date().getTime() - date.getTime()
    return Math.round(diff / 1000)
  }
  private getDiffTimeInSeconds(date: Date, date2: Date) {
    const diff = date2.getTime() - date.getTime()
    return Math.round(diff / 1000)
  }

  private getNextJob(groupName: string, lastJobName: string) {
    const group = this.jobGroups.find((g) => g.name === groupName)
    const next = group?.jobs.findIndex((j) => j.name === lastJobName)

    if (next == undefined || next == null) return null
    if (next < 0) return null
    const nextIndex = next + 1
    const nextJob = group?.jobs[nextIndex]
    return nextJob ?? null
  }

  private validateJob(groupName: string) {
    const group = this.jobGroups.find((g) => g.name === groupName)
    if (!group) throw new Error(`El grupo de jobs ${groupName} no existe`)
    if (group.jobs.length == 0)
      throw new Error(`El grupo de jobs ${groupName} no tiene jobs`)
    return group
  }

  getGroups() {
    return this.jobGroups
  }

  isRunning() {
    return this.logs.some((l) => !l.closed)
  }
}

const isIzipay = (text: string) => {
  if (text == 'ARCHIVOS IZIPAY-TODOS') return true
  return false
}
