import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
import { AxiosInstance } from 'axios'
import { IKardex } from 'pizzadb'
import client from '../client'

export class KardexApi{
  constructor(private readonly client: AxiosInstance) {}


  @axiosCatch
  async getItemsTemplate() {
    const result = await this.client.get<{data: IKardex[]}>('kardex')
    return result.data.data
  }

}
export const kardexApi= new KardexApi(client)
