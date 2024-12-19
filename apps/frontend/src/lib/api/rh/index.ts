import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
import { AxiosInstance } from 'axios'
import type { Attendance, JobTitle, RhEmployee } from 'pizzadb'
import type { IFilterResponse, IUserFilter3 } from 'shared'
import client from '../client'

export class RhApi {
  constructor(private readonly client: AxiosInstance) {}

  @axiosCatch
  async filterEmployees(filters: IUserFilter3<RhEmployee>) {
    const parsed = JSON.stringify(filters)
    const result = await this.client.get('rh/employees/filter', {
      params: {
        filters: parsed,
      },
    })
    return result.data.data as IFilterResponse<RhEmployee>
  }

  @axiosCatch
  async createEmployee(data: FormData) {
    await this.client({
      method: 'post',
      url: 'rh/employees',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  @axiosCatch
  async updateEmployee(employee: FormData) {
    const request = await this.client.put('rh/employees', employee)
    return request.data
  }

  @axiosCatch
  async filterAssistance(store: string, dates: string[], userId?: number) {
    const assistences = await this.client.get<{ data: Attendance[] }>(
      'rh/assistances/filter',
      {
        params: {
          store,
          dates,
          userId,
        },
      },
    )
    return assistences.data.data
  }

  @axiosCatch
  async getEmployeesBySucursal(store?: string) {
    const request = await this.client.get<{ data: RhEmployee[] }>(
      'rh/sucursal/employees',
      {
        params: {
          store,
        },
      },
    )
    return request.data.data
  }

  @axiosCatch
  async getJobsTitle() {
    const request = await this.client.get<{ data: JobTitle[] }>('rh/jobs-title')
    return request.data.data
  }

  @axiosCatch
  async createJobTitle(jobTitle: JobTitle) {
    await this.client.post('rh/jobs-title', jobTitle)
  }

  @axiosCatch
  async updateJobTitle(jobTitle: JobTitle) {
    await this.client.put('rh/jobs-title', jobTitle)
  }

  // @axiosCatch
  async saveMotorizer(motorizer: any) {
    try {
      await this.client.post('rh/motorizer', motorizer)
    } catch (err) {
      console.log('No se pudo guardar el motorizado')
    }
  }
}

export const rhApi = new RhApi(client)
