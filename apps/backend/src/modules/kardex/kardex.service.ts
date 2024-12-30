import { Fillime, InvKardex } from 'pizzadb'
import { Repository } from 'typeorm'
import { findOptions } from '../../lib/filters'

export class KardexService {
  constructor(private readonly kardexRepository: Repository<InvKardex>) {}

  async kardex() {
    return await this.kardexRepository.find({
      relations: {
        warehouse: true,
      },
      take: 100,
    })
  }

  async filterKardex(data: Fillime<InvKardex>) {
    return await this.kardexRepository.find(findOptions(data))
  }
}
