import { Sucursal } from 'pizzadb'
import { In, Repository } from 'typeorm'
import { WarehousesRepository } from '../inventory/entities/repositories/warehouses.repository'
import {
  WAREHOUSE_TYPE,
  WarehouseLegal,
  WarehouseRoute,
} from '../inventory/entities/warehouse'

export class WarehouseService {
  constructor(
    private readonly warehouseRepository: WarehousesRepository,
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async getWarehouses(): Promise<WarehouseLegal[]> {
    const warehouses = await this.warehouseRepository.getWarehousesLegal()
    return warehouses
  }

  async createWarehouse(warehouse: WarehouseLegal): Promise<void> {
    await this.warehouseRepository.createWarehouse(warehouse)
  }

  async updateWarehouse(warehouse: WarehouseLegal): Promise<void> {
    await this.warehouseRepository.updateWarehouse(warehouse)
  }

  async getWarehouseRoutes(): Promise<WarehouseRoute[]> {
    const warehouses = await this.sucursalRepository.find({
      where: {
        status: 1,
        type_sede: WAREHOUSE_TYPE.STORE,
      },
      order: {
        title: 'ASC',
      },
    })
    return warehouses.map(
      (el) =>
        ({
          code: el.id,
          name: el.title,
          route: el.ubi_route ?? '',
          type: el.type_sede as WAREHOUSE_TYPE,
        }) satisfies WarehouseRoute,
    )
  }

  async updateWarehouseRoutes(
    warehouseIds: string[],
    route: string,
  ): Promise<void> {
    if (warehouseIds.length == 0) return
    await this.sucursalRepository.update(
      {
        id: In(warehouseIds),
      },
      { ubi_route: route },
    )
  }
}
