import { AxiosInstance } from 'axios'
import { Session } from 'shared'
import client from '../client'

export class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  async userValidate() {
    const result = await this.client.get<{ data: Session }>(
      'auth/user-validate',
    )
    return result.data.data
  }
}
export const authApi = new AuthApi(client)
