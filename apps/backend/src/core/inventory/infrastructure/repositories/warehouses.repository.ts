import { Sucursal } from 'pizzadb'
import { cache } from '../../../../lib/cache'
import sucursalRepository from '../../../../repositories/sucursal.repository'
import { WarehousesRepository } from '../../entities/repositories/warehouses.repository'
import {
  Warehouse,
  WAREHOUSE_TYPE,
  WarehouseLegal,
} from '../../entities/warehouse'

export class WarehousesRepositoryImpl implements WarehousesRepository {
  async updateWarehouse(warehouse: WarehouseLegal): Promise<void> {
    await sucursalRepository.update(
      {
        id: warehouse.code,
      },
      {
        title: warehouse.name,
        type_sede: warehouse.type ?? WAREHOUSE_TYPE.STORE,
        ubi_address: warehouse.legalAddress,
        cfd_serie: warehouse.serie,
        cfd_correlativo: warehouse.correlativo,
        guide_serie: warehouse.guideSerie,
        guide_correlativo: warehouse.guideCorrelativo,
        sede_nro_ruc: warehouse.legalNumber,
        ubi_district: warehouse.district,
        legalperson_name: warehouse.legalName,
      },
    )
  }

  async createWarehouse(warehouse: WarehouseLegal): Promise<void> {
    await sucursalRepository.insert({
      id: warehouse.code,
      title: warehouse.name,
      type_sede: warehouse.type ?? WAREHOUSE_TYPE.STORE,
      ubi_address: warehouse.legalAddress,
      cfd_serie: warehouse.serie,
      cfd_correlativo: warehouse.correlativo,
      guide_serie: warehouse.guideSerie,
      guide_correlativo: warehouse.guideCorrelativo,
      sede_nro_ruc: warehouse.legalNumber,
      ubi_district: warehouse.district,
      legalperson_name: warehouse.legalName,
    })
  }

  async isWarehouse(code: string): Promise<boolean> {
    // const warehouses = await sucursalRepository.find({})
    let warehouses: Sucursal[] = []
    const cached = cache.get('warehouses') as Sucursal[]
    if (cached) {
      warehouses = cached
    } else {
      warehouses = await sucursalRepository.find({})
      cache.set('warehouses', warehouses)
    }
    const warehouse = warehouses.find((w) => w.id === code)
    if (!warehouse)
      throw new Error('No se encontro sucursal con el codigo : ' + code)
    return warehouse.type_sede == 'W'
  }

  async getWarehouse(code: string): Promise<Warehouse | null> {
    let warehouses: Sucursal[] = []
    const cached = cache.get('warehouses') as Sucursal[]
    if (cached) {
      warehouses = cached
    } else {
      warehouses = await sucursalRepository.find({})
      cache.set('warehouses', warehouses)
    }
    // const warehouse = await sucursalRepository.findOne({
    //   where: { id: code },
    // })
    const warehouse = warehouses.find((w) => w.id === code)
    if (!warehouse) return null
    return {
      code: warehouse.id,
      name: warehouse.title,
      type: warehouse.type_sede as WAREHOUSE_TYPE,
    }
  }

  async getWarehouseLegal(code: string): Promise<WarehouseLegal | null> {
    const warehouse = await sucursalRepository.findOne({ where: { id: code } })
    if (!warehouse) return null
    return {
      code: warehouse.id,
      name: warehouse.title,
      type: warehouse.type_sede as WAREHOUSE_TYPE,
      legalAddress: warehouse.ubi_address,
      legalName: warehouse.legalperson_name,
      legalNumber: warehouse.sede_nro_ruc ?? '',
      serie: warehouse.cfd_serie,
      correlativo: warehouse.cfd_correlativo ?? 1,
      guideSerie: warehouse.guide_serie,
      guideCorrelativo: warehouse.guide_correlativo ?? 1,
      district: warehouse.ubi_district ?? '',
    }
  }

  async getWarehousesLegal(): Promise<WarehouseLegal[]> {
    const warehouses = await sucursalRepository.find({
      order: {
        title: 'ASC',
      },
    })
    return warehouses.map(
      (warehouse) =>
        ({
          code: warehouse.id,
          name: warehouse.title,
          type: warehouse.type_sede as WAREHOUSE_TYPE,
          legalAddress: warehouse.ubi_address,
          legalName: warehouse.legalperson_name,
          legalNumber: warehouse.sede_nro_ruc ?? '',
          serie: warehouse.cfd_serie,
          correlativo: warehouse.cfd_correlativo ?? 1,
          guideSerie: warehouse.guide_serie,
          guideCorrelativo: warehouse.guide_correlativo ?? 1,
          district: warehouse.ubi_district ?? '',
        }) satisfies WarehouseLegal,
    )
  }

  async getWarehouses(): Promise<Warehouse[]> {
    const warehouses = await sucursalRepository.find({
      order: {
        title: 'ASC',
      },
    })
    return warehouses.map((el) => ({
      code: el.id,
      name: el.title,
      type: el.type_sede as WAREHOUSE_TYPE,
    }))
  }

  async getWarehousesByType(type: WAREHOUSE_TYPE): Promise<Warehouse[]> {
    const warehouses = await sucursalRepository.find()

    return warehouses
      .filter((el) => el.type_sede == type)
      .map((el) => ({
        code: el.id,
        name: el.title,
        type: el.type_sede as WAREHOUSE_TYPE,
      }))
  }
}
