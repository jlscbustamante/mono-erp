import { Sucursal } from 'pizzadb'
import { IUserFilter3 } from 'shared'
import { Repository } from 'typeorm'
import { filter3 } from '../../repositories/filter3base'

export class CommonService {
  constructor(private readonly sucursalRepository: Repository<Sucursal>) {}

  async filterSucursal(filters: IUserFilter3<Sucursal>) {
    const data = await filter3(this.sucursalRepository, filters)
    return data
  }
}
