import { AxiosInstance } from 'axios'
import type { Sucursal } from 'pizzadb'
import type { IFilterResponse, IUserFilter3 } from 'shared'
import client from '../client'
import config from '@/config'
import { ITEM } from '@/const/localStorageItems'

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

  async createIamLog(data: any) {
    const token = localStorage.getItem(ITEM.TOKEN)
    try {
      const response = await fetch(
        `${config.API}/security/iam-log/create-iamLog`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(data),
        },
      )

      if (!response.ok) {
        throw new Error('Error al crear el iam-log')
      }

      const responseData = await response.json()

      return responseData
    } catch (error) {
      console.error('Error al crear el iam-log:', error)
      throw error
    }
  }

  private manageError(error: any) {
    const message = (error as any).response?.data?.message
    if (message) throw new Error(message)
    throw error
  }
}
export const commonApi = new CommonApi(client)
