import { AxiosInstance } from 'axios'
import { IamFunction, IamPermission } from 'pizzadb'
import { Session, UpdateRoleDto } from 'shared'
import client from '../client'

export class AuthApi {
  constructor(private readonly client: AxiosInstance) {}

  async userValidate() {
    const result = await this.client.get<{ data: Session }>(
      'auth/user-validate',
    )
    return result.data.data
  }

  async getFunctions() {
    const result = await this.client.get<{ data: IamFunction[] }>(
      'auth/functions',
    )
    return result.data.data
  }

  async updateRole(updateRole: UpdateRoleDto) {
    await this.client.put('/auth/update-role', updateRole)
  }

  async getRolePermissions(id: number) {
    const result = await this.client.get<{ data: IamPermission[] }>(
      `auth/role-permissions?id=${id}`,
    )
    return result.data.data
  }
}
export const authApi = new AuthApi(client)
