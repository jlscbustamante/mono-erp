import { AppDataSource } from '../config/database'
import { SucursalSale } from '../entities/adm/SucursalSale'

export const sucursaSaleRepository = AppDataSource.getRepository(SucursalSale)
