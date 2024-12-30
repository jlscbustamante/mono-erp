import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
import { AxiosInstance } from 'axios'
import type { Fillime, IKardex, InvKardex } from 'pizzadb'
import client from '../client'

export class KardexApi {
  constructor(private readonly client: AxiosInstance) {}

  @axiosCatch
  async getItemsTemplate() {
    const result = await this.client.get<{ data: IKardex[] }>('kardex')
    return result.data.data
  }

  @axiosCatch
  async filterKardex(data: Fillime<InvKardex>) {
    const filters = JSON.stringify(data)
    const request = await this.client.get('kardex/filter', {
      params: {
        filters,
      },
    })
    return request.data
  }
}
export const kardexApi = new KardexApi(client)
