import { InvKardex } from "pizzadb";
import { Repository } from "typeorm";

export class KardexService {
  constructor(
    private readonly kardexRepository: Repository<InvKardex>
  ){}

  async kardex(){
    return await this.kardexRepository.find({
      relations: {
        warehouse: true
      },
      take: 100
    })
  }
}