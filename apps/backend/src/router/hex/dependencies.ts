import { Carrier, InvStock } from 'pizzadb'
import { AppDataSource } from '../../config/database'
import { AuthService } from '../../core/auth/auth.service'
import { WarehouseService } from '../../core/common/warehouse.service'
import { SendDispatch } from '../../core/efises/application/send_dispatch'
import { RelationsRepositoryImpl } from '../../core/efises/infrastructure/relations.repository'
import { CreateDispatch } from '../../core/inventory/application/create_dispatch'
import { CreateInitialStock } from '../../core/inventory/application/create_initial_stock'
import { DispatchItems } from '../../core/inventory/application/dispatch_items'
import { GenerateTemplateDispatch } from '../../core/inventory/application/generate_template_dispatch'
import { GenerateTemplateEditStock } from '../../core/inventory/application/generate_template_stock'
import { MoveBetweenStores } from '../../core/inventory/application/move_between_stores'
import { ReadStock } from '../../core/inventory/application/read_stock'
import { SaveBiStock } from '../../core/inventory/application/save_bi_stock'
import { SaveStock } from '../../core/inventory/application/save_stock'
import { StorePurchase } from '../../core/inventory/application/store_purchase'
import { DispatchUtil } from '../../core/inventory/dispatch-util.service'
import { DispatchRepositoryImpl } from '../../core/inventory/infrastructure/repositories/dispatch.repository'
import { ItemRepositoryImpl } from '../../core/inventory/infrastructure/repositories/item.repository'
import { PurchaseRepositoryImpl } from '../../core/inventory/infrastructure/repositories/purchase.repository'
import { StockRepositoryImpl } from '../../core/inventory/infrastructure/repositories/stock.repository'
import { TemplateRepositoryImpl } from '../../core/inventory/infrastructure/repositories/template.repository'
import { WarehousesRepositoryImpl } from '../../core/inventory/infrastructure/repositories/warehouses.repository'
import { InventoryService } from '../../core/inventory/inventory.service'
import { DispatchService } from '../../core/services/dispatch.service'
import { OtpService } from '../../core/services/otp.service'
import { invDispatchRepository } from '../../repositories/inventory/dispatch.repository'
import { productItemRepository } from '../../repositories/inventory/item.repository'
import { invPurchaseRepository } from '../../repositories/inventory/purchase.repository'
import sucursalRepository from '../../repositories/sucursal.repository'
import { DriverService } from './inventory/driver.service'

export const itemRepository = new ItemRepositoryImpl()
export const warehouseRepository = new WarehousesRepositoryImpl()
export const templateRepository = new TemplateRepositoryImpl(
  warehouseRepository,
)

const stockDbRepository = AppDataSource.getRepository(InvStock)

export const stockRepository = new StockRepositoryImpl(
  templateRepository,
  warehouseRepository,
  itemRepository,
  stockDbRepository,
)
export const dispatchRepository = new DispatchRepositoryImpl()
export const purchaseRepository = new PurchaseRepositoryImpl()

export const readStockUseCase = new ReadStock(stockRepository)
export const saveBiStockUseCase = new SaveBiStock(stockRepository)

export const driverRepository = AppDataSource.getRepository(Carrier)

export const generateTemplateStockUseCase = new GenerateTemplateEditStock(
  stockRepository,
  templateRepository,
  itemRepository,
)

export const dispatchItemsUseCase = new DispatchItems(
  generateTemplateStockUseCase,
  saveBiStockUseCase,
  templateRepository,
  dispatchRepository,
  warehouseRepository,
)

export const moveBetweenStoresUseCase = new MoveBetweenStores(
  generateTemplateStockUseCase,
  stockRepository,
  dispatchRepository,
)
const invStockRepository = AppDataSource.getRepository(InvStock)

export const dispatchUtil = new DispatchUtil(
  templateRepository,
  invDispatchRepository,
  invStockRepository,
  invPurchaseRepository,
  productItemRepository,
)

export const saveStockUseCase = new SaveStock(
  stockRepository,
  dispatchRepository,
  generateTemplateStockUseCase,
  dispatchUtil,
)

export const storePurchaseUseCase = new StorePurchase(
  generateTemplateStockUseCase,
  purchaseRepository,
  saveStockUseCase,
  warehouseRepository,
  itemRepository,
  stockRepository,
)

export const createDispatch = new CreateDispatch(
  saveBiStockUseCase,
  templateRepository,
  dispatchRepository,
  warehouseRepository,
  generateTemplateStockUseCase,
)

export const generateTemplateDispatchUseCase = new GenerateTemplateDispatch(
  stockRepository,
  templateRepository,
)

export const createInitialStockUseCase = new CreateInitialStock(
  generateTemplateStockUseCase,
  stockRepository,
)

export const relationsRepository = new RelationsRepositoryImpl()

export const sendDispatchEfisUseCase = new SendDispatch(
  dispatchRepository,
  relationsRepository,
  warehouseRepository,
)

export const dispatchService = new DispatchService(
  dispatchRepository,
  dispatchItemsUseCase,
  invDispatchRepository,
)

export const otpService = new OtpService()

export const authService = new AuthService(otpService)

export const inventoryService = new InventoryService(
  dispatchRepository,
  itemRepository,
  warehouseRepository,
  templateRepository,
  invStockRepository,
  productItemRepository,
)

export const driverService = new DriverService(driverRepository)

export const warhouseService = new WarehouseService(
  warehouseRepository,
  sucursalRepository,
)
