import { AppDataSource } from '../../config/database'
import { InvDispatchBase } from '../../entities/inventory/InvDispatchBase'
import { InvDispatchBaseItem } from '../../entities/inventory/InvDispatchBaseItem'

export const invDispatchBaseItemRepository =
  AppDataSource.getRepository(InvDispatchBaseItem)

export const invDispatchBase = AppDataSource.getRepository(InvDispatchBase)
