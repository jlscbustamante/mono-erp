import { InvDispatch } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { InvKardex } from '../../entities/inventory/InvKardex'
import { productItemRepository } from '../../repositories/inventory/item.repository'
import { invPurchaseRepository } from '../../repositories/inventory/purchase.repository'
import { KardexService } from './kardex.service'

export const kardexRepository = AppDataSource.getRepository(InvKardex)
const dispatchRepository = AppDataSource.getRepository(InvDispatch)

export const kardexService = new KardexService(
  kardexRepository,
  productItemRepository,
  dispatchRepository,
  invPurchaseRepository,
)
