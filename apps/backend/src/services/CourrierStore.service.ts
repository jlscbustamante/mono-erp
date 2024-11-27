import { CourrierStore } from '../entitiesDriver/Courrier_Store'

export class CourrierStoreService {
  private readonly courrierStoreRepository: any
  constructor(courrierStoreRepository: any) {
    this.courrierStoreRepository = courrierStoreRepository
  }

  async createCourrier(id: number, courrierId: string): Promise<void> {
    const newCourrierStore = new CourrierStore()
    newCourrierStore.courrier_id = Number(courrierId)
    newCourrierStore.cia_id = 6 // cambiar
    newCourrierStore.store_id = Number(id)
    newCourrierStore.old_store_id = 0
    await this.courrierStoreRepository.save(newCourrierStore)
  }
  async updateCourrier(id: number, courrierStore: CourrierStore) {
    courrierStore.store_id = id
    await this.courrierStoreRepository.save(courrierStore)
  }
}
