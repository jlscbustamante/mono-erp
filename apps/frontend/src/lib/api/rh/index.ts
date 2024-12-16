import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
import { AxiosInstance } from 'axios'
import { Attendance, RhEmployee } from 'pizzadb'
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
  async filterAssistance(store: string, dates: string[]) {
    const assistences = await this.client.get<{ data: Attendance[] }>(
      'rh/assistances/filter',
      {
        params: {
          store,
          dates,
        },
      },
    )
    return assistences.data.data
  }
}

export const rhApi = new RhApi(client)
