import {
  Attendance,
  IamPermission,
  IamRole,
  IamUser,
  InvDispatch,
  InvKardex,
  InvStock,
  JobTitle,
  RhEmployee,
  Sucursal,
} from 'pizzadb'
import { AppDataSource } from '../config/database'

export const iamUserRepository = AppDataSource.getRepository(IamUser)
export const iamRoleRepository = AppDataSource.getRepository(IamRole)
export const iamPermissionRepository =
  AppDataSource.getRepository(IamPermission)
export const invDispatchRepository = AppDataSource.getRepository(InvDispatch)
export const invStockRepository = AppDataSource.getRepository(InvStock)

export const rhEmployeeRepository = AppDataSource.getRepository(RhEmployee)
export const assistancesRepository = AppDataSource.getRepository(Attendance)

export const jobsTitleRepository = AppDataSource.getRepository(JobTitle)
export const sucursalRepository = AppDataSource.getRepository(Sucursal)


export const kardexRepository= AppDataSource.getRepository(InvKardex)