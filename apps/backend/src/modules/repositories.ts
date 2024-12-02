import { IamPermission, IamRole, IamUser } from 'pizzadb'
import { AppDataSource } from '../config/database'

export const iamUserRepository = AppDataSource.getRepository(IamUser)
export const iamRoleRepository = AppDataSource.getRepository(IamRole)
export const iamPermissionRepository =
  AppDataSource.getRepository(IamPermission)
