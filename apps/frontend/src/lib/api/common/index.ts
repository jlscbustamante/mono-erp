import { AxiosInstance } from 'axios'
import type { Sucursal } from 'pizzadb'
import type { IFilterResponse, IUserFilter3 } from 'shared'
import client from '../client'

export class CommonApi {
  constructor(private readonly client: AxiosInstance) {}

  async getSucursales(filters: IUserFilter3<Sucursal>) {
    try {
      const parsed = JSON.stringify(filters)
      const result = await this.client.get('common/sucursal/filter', {
        params: {
          filters: parsed,
        },
      })
      return result.data.data as IFilterResponse<Sucursal>
    } catch (err: any) {
      this.manageError(err)
    }
  }

  private manageError(error: any) {
    const message = (error as any).response?.data?.message
    if (message) throw new Error(message)
    throw error
  }
}
export const commonApi = new CommonApi(client)
