import { InvDispatch } from 'pizzadb'
import { Repository } from 'typeorm'
import { cache } from '../../lib/cache'

export class InventoryService {
  constructor(private readonly dispatchRepository: Repository<InvDispatch>) {}

  async createOrder() {
    const value = cache.get('despacho_683')
    if (value) {
      return value
    }
    const dispatch = await this.dispatchRepository.findOne({
      where: {
        id: 683,
      },
    })
    if (!dispatch) throw new Error('Despacho no encontrado')
    cache.set('despacho_683', dispatch)
    return dispatch
  }
}
