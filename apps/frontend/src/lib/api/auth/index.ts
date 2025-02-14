import { axiosCatch } from '@/utils/middleware/axios-catch.middleware'
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

  @axiosCatch
  async login(data: { email: string; password: string }) {
    const result = await this.client.post<{ data: string }>('auth/login', data)
    return result.data.data
  }

  @axiosCatch
  async resetPassword(email: string) {
    const result = await this.client.post<{ data: string }>(
      'auth/resetPassword',
      {
        email,
      },
    )

    return result.data.data
  }

  @axiosCatch
  async validateLogin(data: { otp: string; token: string }) {
    const result = await this.client.post<{
      data: { session: Session; token: string }
    }>('auth/validate-login', data)
    return result.data.data
  }

  @axiosCatch
  async validateOtp(data: { otp: string; token: string }) {
    const result = await this.client.post<{
      data: string
    }>('auth/validate-otp-recover', data)
    return result.data.data
  }

  @axiosCatch
  async changePassword(data: { password: string; token: string }) {
    const result = await this.client.post<{
      data: { session: Session; token: string }
    }>('auth/changePassword', data)
    return result.data.data
  }

  @axiosCatch
  async resendOtp(data: { token: string }) {
    const result = await this.client.post('auth/resend-otp', data)
    return result.data
  }
}
export const authApi = new AuthApi(client)
