import { Warehouse, WAREHOUSE_TYPE, WarehouseLegal } from '../warehouse'

export interface WarehousesRepository {
  isWarehouse(code: string): Promise<boolean>

  getWarehouses(): Promise<Warehouse[]>

  getWarehousesLegal(): Promise<WarehouseLegal[]>

  createWarehouse(warehouse: WarehouseLegal): Promise<void>

  updateWarehouse(warehouse: WarehouseLegal): Promise<void>

  getWarehouse(code: string): Promise<Warehouse | null>

  getWarehouseLegal(code: string): Promise<WarehouseLegal | null>

  getWarehousesByType(type: WAREHOUSE_TYPE): Promise<Warehouse[]>
}
