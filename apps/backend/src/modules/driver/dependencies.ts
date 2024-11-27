import { Carrier } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { DriverController } from './driver.controller'
import { DriverService } from './driver.service'

export const driverRepository = AppDataSource.getRepository(Carrier)

export const driverService = new DriverService(driverRepository)

export const driverController = new DriverController()
