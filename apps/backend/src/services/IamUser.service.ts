import bcrypt from 'bcrypt'

import { IamUser } from 'pizzadb'
import { IamUserRepository } from '../repositories/iamUser.repository'
import { EnvFilters } from '../types'
import { dateNow } from '../utils/getDate'

type EditIamUser = {
  name: string
  email: string
  rol_id: number
  status: number
  password: string
}

type CreateIamUser = {
  name: string
  email: string
  password: string
  rol_id: number
  status: number
}
export class IamUserService {
  private readonly IamUserRepository: IamUserRepository
  constructor(IamUserRepository: IamUserRepository) {
    this.IamUserRepository = IamUserRepository
  }

  async getFilteredIamUserNt(filters: EnvFilters<IamUser>): Promise<IamUser[]> {
    return this.IamUserRepository.filterNt(filters)
  }

  async changePassword(existingIamUser: IamUser, args: string): Promise<void> {
    const pass = await bcrypt.hash(args, 10)
    try {
      existingIamUser.password = pass
      await this.IamUserRepository.save(existingIamUser)
    } catch (err: any) {
      throw new Error(`Error al actualizar: ${err}`)
    }
  }

  async updateIamUser(
    existingIamUser: IamUser,
    args: EditIamUser,
  ): Promise<void> {
    try {
      ;(existingIamUser.status = args.status),
        (existingIamUser.email = args.email),
        (existingIamUser.rol_id = args.rol_id),
        (existingIamUser.name = args.name),
        (existingIamUser.created_at = dateNow())
      await this.IamUserRepository.save(existingIamUser)
    } catch (error: any) {
      throw new Error(`Error al actualizar: ${error}`)
    }
  }

  async updateIamUserPassword(
    existingIamUser: IamUser,
    password: string,
  ): Promise<void> {
    try {
      const pass = await bcrypt.hash(password, 10)
      existingIamUser.password = pass
      await this.IamUserRepository.save(existingIamUser)
    } catch (err: any) {
      throw new Error(`Error al actualizar: ${err}`)
    }
  }

  async updateConfirmPassword(
    existingIamUser: IamUser,
    password: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const pass = await bcrypt.hash(newPassword, 10)

      if (await bcrypt.compare(password, existingIamUser.password)) {
        existingIamUser.password = pass
        await this.IamUserRepository.save(existingIamUser)
      } else {
        throw new Error(`Error al actualizar`)
      }
    } catch (err: any) {
      throw new Error(`Error al actualizar: ${err}`)
    }
  }

  async createIamUser(args: CreateIamUser): Promise<void> {
    const newIamUser = new IamUser()
    try {
      ;(newIamUser.status = args.status),
        (newIamUser.email = args.email),
        (newIamUser.password = ''),
        (newIamUser.rol_id = args.rol_id),
        (newIamUser.name = args.name),
        (newIamUser.created_at = dateNow()),
        (newIamUser.updated_at = dateNow())

      await this.IamUserRepository.save(newIamUser)
    } catch (err: any) {
      throw new Error(`Error al crear IamUser: ${err}`)
    }
  }
}
