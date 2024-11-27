import { Carrier } from 'pizzadb'
import { Repository } from 'typeorm'
import { filter3 } from '../../repositories/filter3base'
import { IUserFilter3 } from '../../types/filter'

export class DriverService {
  constructor(private readonly driverRepository: Repository<Carrier>) {}

  async filterDriver(filters: IUserFilter3<Carrier>) {
    const data = await filter3(this.driverRepository, filters)
    return data
  }
}
