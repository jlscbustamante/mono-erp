import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
import { AxiosInstance } from 'axios'
import type { Carrier, Sucursal } from 'pizzadb'
import type { IFilterResponse, IUserFilter3 } from 'shared'
import client from '../client'

export class InventoryApi {
  constructor(private readonly client: AxiosInstance) {}

  async filterCarrier(filters: IUserFilter3<Carrier>) {
    try {
      const parsed = JSON.stringify(filters)
      const result = await this.client.get('driver/filter', {
        params: {
          filters: parsed,
        },
      })
      return result.data.data as IFilterResponse<Carrier>
    } catch (err: any) {
      this.manageError(err)
    }
  }

  async getItemsTemplate() {
    const result = await this.client.get('inventory/template/items')
    return result.data.data
  }

  @axiosCatch
  async sucursales():Promise<Sucursal[]>{
    const result=await this.client.get('inventory/sucursales')
    return result.data.data
  }

  private manageError(error: any) {
    const message = (error as any).response?.data?.message
    if (message) throw new Error(message)
    throw error
  }
}
export const inventoryApi = new InventoryApi(client)
