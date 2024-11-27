import { Sucursal } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { CommonController } from './common.controller'
import { CommonService } from './common.service'

export const sucursalRepository = AppDataSource.getRepository(Sucursal)

export const commonController = new CommonController()
export const commonService = new CommonService(sucursalRepository)
