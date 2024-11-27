import { Repository } from 'typeorm'

import { Carrier } from 'pizzadb'
import { UpdateDriverDto } from '../../../core/inventory/dto'
import { CreateDriverDto } from '../../../core/inventory/dto/create-driver.dto'
import { filter3Base } from '../../../repositories/filter3base'
import { IUserFilter3 } from '../../../types/filter'

export class DriverService {
  constructor(private readonly driverRepository: Repository<Carrier>) {
    this.driverRepository.extend({
      filter3: filter3Base,
    })
  }

  async getAllDrivers(): Promise<Carrier[]> {
    return await this.driverRepository.find({
      where: { status: '1' },
    })
  }

  async drivers(): Promise<Carrier[]> {
    return await this.driverRepository.find({})
  }
  async filterDrivers(filters: IUserFilter3<Carrier>): Promise<Carrier[]> {
    const data = await (this.driverRepository as any).filter3(filters)
    return data.data
  }

  async createDriver(driverDto: CreateDriverDto) {
    const driver = this.driverRepository.create(driverDto)
    await this.driverRepository.save(driver)

    return driver
  }

  async updateDriver(driver: UpdateDriverDto) {
    await this.driverRepository.update(driver.id, driver)
  }

  async delete(driverId: number) {
    await this.driverRepository.delete(driverId)
  }
}
