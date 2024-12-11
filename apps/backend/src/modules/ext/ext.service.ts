import { Repository } from 'typeorm'
import { InvPurchase } from '../../entities/inventory/Purchase'

export class ExtService {
  constructor(
    private readonly invPurchaseRepository: Repository<InvPurchase>,
  ) {}

  async getPurchase(purchaseId: number) {
    const purchase = await this.invPurchaseRepository.findOne({
      where: {
        id: purchaseId,
      },
      relations: {
        items: true,
      },
    })
    return purchase
  }
}
