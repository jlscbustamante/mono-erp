import { In, Raw } from 'typeorm'

import {
  DispatchType,
  InvDispatch,
  InvDispatchItem,
  InvDispatchStatus,
  Item,
} from 'pizzadb'
import { AppDataSource } from '../../../../config/database'
import { invDispatchRepository } from '../../../../repositories/inventory/dispatch.repository'
import { productItemRepository } from '../../../../repositories/inventory/item.repository'
import {
  DispatchCreateDto,
  DispatchUpdateDto,
  MoveBetweenStoresDto,
} from '../../dto'
import {
  Dispatch,
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchItem,
  DispatchLegal,
  DispatchRoute,
  DispatchRouteItem,
} from '../../entities/dispatch'
import { DispatchRepository } from '../../entities/repositories/dispatch.repository'
import { WAREHOUSE_TYPE } from '../../entities/warehouse'

export class DispatchRepositoryImpl implements DispatchRepository {
  async changeStatus(id: number, status: DISPATCH_STATUS): Promise<void> {
    await invDispatchRepository.update(id, {
      status: status as any,
    })
  }

  async saveDispatch(
    dispatchUpdate: DispatchUpdateDto,
    user?: string,
  ): Promise<void> {
    const netValue = dispatchUpdate.items.reduce(
      (acc, el) => acc + el.totalValue,
      0,
    )
    const totalValue = netValue + dispatchUpdate.taxValue
    const approvedBy = user ?? 'sys'
    const items: Partial<InvDispatchItem>[] = dispatchUpdate.items.map((el) => {
      return {
        itemId: el.itemId,
        itemName: el.itemName,
        measureId: el.measureId,
        quantity: el.quantity,
        unitValue: el.unitValue,
        totalValue: el.totalValue,
        presentationId: el.presentationId,
        presentationName: el.presentationName,
        dispatchId: dispatchUpdate.id,
        weight: 0,
      } satisfies Partial<InvDispatchItem>
    })
    const itemsDB = await invDispatchRepository.findOne({
      where: {
        id: dispatchUpdate.id,
      },
      relations: {
        items: true,
      },
    })
    const itemsDb = itemsDB?.items ?? []
    const toUpdate: Partial<InvDispatchItem>[] = []
    const toCreate: Partial<InvDispatchItem>[] = []
    let toDelete: number[] = itemsDb.map((el) => el.id)
    for (const item of items) {
      const itemInDb = itemsDb.find((el) => el.itemId == item.itemId)
      if (itemInDb) {
        toUpdate.push({
          id: itemInDb.id,
          ...item,
        })
        toDelete = toDelete.filter((el) => el != itemInDb.id)
      } else {
        toCreate.push(item)
      }
    }

    await AppDataSource.transaction(async (manager) => {
      await manager.update(InvDispatch, dispatchUpdate.id, {
        totalValue,
        approvedBy,
        netValue,
        wareFromId: dispatchUpdate.wareFromId,
        wareToId: dispatchUpdate.wareToId,
        numGuide: dispatchUpdate.numGuide,
        numInvoice: dispatchUpdate.numInvoice,
        taxValue: dispatchUpdate.taxValue,
        moveAt: dispatchUpdate.dispatchAt,
        gloss: dispatchUpdate.gloss,
        status: DISPATCH_STATUS.NEW as any,
      })
      if (toDelete.length > 0) {
        await manager.delete(InvDispatchItem, toDelete)
      }
      if (toCreate.length > 0) {
        await manager.insert(InvDispatchItem, toCreate)
      }
      const promises = []
      if (toUpdate.length > 0) {
        for (const item of toUpdate) {
          promises.push(manager.update(InvDispatchItem, item.id, item))
        }
        await Promise.all(promises)
      }
    })
  }

  async createDispatch(
    dispatchUpdate: DispatchCreateDto,
    user?: string,
  ): Promise<number> {
    const netValue = dispatchUpdate.items.reduce(
      (acc, el) => acc + el.totalValue,
      0,
    )
    const totalValue = netValue - dispatchUpdate.taxValue
    const approvedBy =
      dispatchUpdate.status == DISPATCH_STATUS.DISPATCHED ? (user ?? 'sys') : ''
    const items: Partial<InvDispatchItem>[] = dispatchUpdate.items.map((el) => {
      return {
        itemId: el.itemId,
        itemName: el.itemName,
        measureId: el.measureId,
        quantity: el.quantity,
        unitValue: el.unitValue,
        totalValue: el.totalValue,
        presentationId: el.presentationId,
        presentationName: el.presentationName,
        dispatchId: 0,
        weight: 0,
      } satisfies Partial<InvDispatchItem>
    })
    let dispatchId: null | number = null
    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, {
        totalValue,
        approvedBy,
        netValue,
        wareFromId: dispatchUpdate.wareFromId,
        wareToId: dispatchUpdate.wareToId,
        numGuide: dispatchUpdate.numGuide,
        numInvoice: dispatchUpdate.numInvoice,
        taxValue: dispatchUpdate.taxValue,
        createdBy: user ?? 'sys',
        moveAt: dispatchUpdate.dispatchAt,
        gloss: dispatchUpdate.gloss,
        status: dispatchUpdate.status as any,
      } satisfies Partial<InvDispatch>)
      const insertId = result.raw.insertId
      const itemsToSave = items.map((el) => ({ ...el, dispatchId: insertId }))
      await manager.insert(InvDispatchItem, itemsToSave)
      dispatchId = Number(insertId)
    })
    if (!dispatchId) throw new Error('No se pudo crear el despacho')
    return dispatchId
  }

  async createMovement(
    movement: MoveBetweenStoresDto,
    status: DISPATCH_STATUS,
    user?: string,
  ): Promise<number> {
    const itemIds = movement.items.map((el) => el.itemId)
    if (itemIds.length == 0)
      throw new Error('No se puede crear un movimiento sin items')
    const items = await productItemRepository.find({
      where: {
        id: In(itemIds),
      },
      relations: {
        product: {
          measure: true,
          category: true,
        },
        presentation: true,
      },
    })
    const itemById: Record<number, Item> = {}
    for (const itemId of itemIds) {
      const item = items.find((el) => el.id == itemId)
      if (!item) throw new Error('No se encontro el item id : ' + itemId)
      itemById[itemId] = item
    }

    const itemsDb: Partial<InvDispatchItem>[] = movement.items.map((el) => {
      const item = itemById[el.itemId]!
      return {
        itemId: item.id,
        itemName: item.itemName,
        measureId: item.product?.measureId ?? item.measureId,
        quantity: el.quantity,
        unitValue: item.unitPrice,
        totalValue: el.quantity * item.unitPrice,
        presentationId: item.presentationId,
        presentationName: item.presentation?.presentation,
        dispatchId: 0,
        weight: 0,
      }
    })
    const total = itemsDb.reduce((acc, el) => acc + (el.totalValue ?? 0), 0)
    const dispatch: Partial<InvDispatch> = {
      wareFromId: movement.storeFrom,
      wareToId: movement.storeToId,
      gloss: movement.gloss,
      moveType: DispatchType.BetweenStores,
      numGuide: '',
      numInvoice: '',
      createdBy: user ?? 'sys',
      moveAt: movement.moveAt,
      status: status as any,
      taxValue: 0,
      netValue: total,
      totalValue: total,
    }
    let dispatchId = 0
    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvDispatch, dispatch)
      dispatchId = result.raw.insertId
      await manager.insert(
        InvDispatchItem,
        itemsDb.map((el) => ({
          ...el,
          dispatchId,
        })),
      )
    })
    return dispatchId
  }

  async countPendingDispatchBeforeAt(
    date: string,
    warehouseId: string,
  ): Promise<number> {
    const dispatchesFrom = await invDispatchRepository.count({
      where: {
        wareToId: warehouseId,
        status: In([InvDispatchStatus.NEW, InvDispatchStatus.APPROVED]),
        moveAt: Raw((alias) => `DATE(${alias}) <= '${date}'`),
      },
    })
    const dispatchesTo = await invDispatchRepository.count({
      where: {
        wareFromId: warehouseId,
        status: In([InvDispatchStatus.NEW, InvDispatchStatus.APPROVED]),
        moveAt: Raw((alias) => `DATE(${alias}) <= '${date}'`),
      },
    })

    const result = dispatchesFrom + dispatchesTo

    return isNaN(result) ? 0 : result
  }

  async getOne(id: number): Promise<Dispatch | null> {
    const dispatchDB = await invDispatchRepository.findOne({
      where: { id: id },
      relations: {
        items: {
          item: {
            product: {
              measure: true,
            },
            presentation: true,
          },
        },
        wareTo: true,
        wareFrom: true,
      },
    })
    const toIsWarehouse = dispatchDB?.wareTo?.type == WAREHOUSE_TYPE.STORE
    const fromIsWarehouse = dispatchDB?.wareFrom?.type == WAREHOUSE_TYPE.STORE
    let moveType = DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE
    if (toIsWarehouse && fromIsWarehouse)
      moveType = DISPATCH_MOVE_TYPE.STORE_TO_STORE

    if (!dispatchDB) return null
    const dispatch: Dispatch = {
      id: dispatchDB.id,
      approvedBy: dispatchDB.approvedBy,
      dispatchAt: dispatchDB.moveAt.split(' ')[0],
      wareFromName: dispatchDB.wareFrom?.name ?? '',
      wareToName: dispatchDB.wareTo?.name ?? '',
      gloss: dispatchDB.gloss,
      moveType,
      netValue: dispatchDB.netValue,
      numGuide: dispatchDB.numGuide ?? '',
      numInvoice: dispatchDB.numInvoice ?? '',
      status: dispatchDB.status as unknown as DISPATCH_STATUS,
      taxValue: dispatchDB.taxValue,
      totalValue: dispatchDB.totalValue,
      wareFromId: dispatchDB.wareFromId,
      wareToId: dispatchDB.wareToId,
      requestBy: dispatchDB.createdBy,
      items:
        dispatchDB.items?.map(
          (el) =>
            ({
              id: el.id,
              dispatchId: dispatchDB.id,
              itemId: el.itemId,
              itemName: el.itemName,
              measureId:
                el.item?.product?.measureId ??
                el.item?.measureId ??
                el.measureId,
              measureCode: el.item?.product?.measure?.code ?? '',
              presentationId: el.item?.presentationId ?? el.presentationId,
              presentationName:
                el.item?.presentation?.presentation ??
                el.presentationName ??
                '',
              quantity: el.quantity,
              unitValue: el.unitValue,
              totalValue: el.totalValue,
            }) satisfies DispatchItem,
        ) ?? [],
    }
    return dispatch
  }

  async getDispatchesRoute(
    date: string,
    route: string,
  ): Promise<DispatchRoute[]> {
    const dispatches = await invDispatchRepository.find({
      where: {
        moveType: DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE as any,
        moveAt: Raw((alias) => `DATE(${alias}) = '${date}'`),
        status: In([InvDispatchStatus.DISPATCHED, InvDispatchStatus.INVOICED]),
        wareTo: {
          ubi_route: route,
        },
      },
      relations: {
        items: {
          item: {
            product: {
              measure: true,
              category: true,
            },
            presentation: true,
          },
        },
        wareTo: true,
        wareFrom: true,
      },
    })
    const dispatchesMapped = dispatches
      .map((dispatchDB) => {
        const toIsWarehouse = dispatchDB?.wareTo?.type == WAREHOUSE_TYPE.STORE
        const fromIsWarehouse =
          dispatchDB?.wareFrom?.type == WAREHOUSE_TYPE.STORE
        let moveType = DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE
        if (toIsWarehouse && fromIsWarehouse)
          moveType = DISPATCH_MOVE_TYPE.STORE_TO_STORE

        if (!dispatchDB) return null
        const dispatch: DispatchRoute = {
          id: dispatchDB.id,
          approvedBy: dispatchDB.approvedBy,
          dispatchAt: dispatchDB.moveAt.split(' ')[0],
          wareFromName: dispatchDB.wareFrom?.name ?? '',
          wareToName: dispatchDB.wareTo?.name ?? '',
          gloss: dispatchDB.gloss,
          moveType,
          netValue: dispatchDB.netValue,
          numGuide: dispatchDB.numGuide ?? '',
          numInvoice: dispatchDB.numInvoice ?? '',
          status: dispatchDB.status as unknown as DISPATCH_STATUS,
          taxValue: dispatchDB.taxValue,
          totalValue: dispatchDB.totalValue,
          wareFromId: dispatchDB.wareFromId,
          wareToId: dispatchDB.wareToId,
          requestBy: dispatchDB.createdBy,
          route: dispatchDB.wareTo?.ubi_route ?? '',
          items:
            dispatchDB.items?.map(
              (el) =>
                ({
                  id: el.id,
                  dispatchId: dispatchDB.id,
                  itemId: el.itemId,
                  itemName: el.itemName,
                  categoryId: el.item?.product?.categoryId ?? 0,
                  categoryName: el.item?.product?.category?.category ?? '',
                  measureId:
                    el.item?.product?.measureId ??
                    el.item?.measureId ??
                    el.measureId,
                  measureCode: el.item?.product?.measure?.code ?? '',
                  presentationId: el.item?.presentationId ?? el.presentationId,
                  presentationName:
                    el.item?.presentation?.presentation ??
                    el.presentationName ??
                    '',
                  quantity: el.quantity,
                  unitValue: el.unitValue,
                  totalValue: el.totalValue,
                }) satisfies DispatchRouteItem,
            ) ?? [],
        }
        return dispatch
      })
      .filter((el) => el != null) as DispatchRoute[]

    return dispatchesMapped
  }

  async getOneLegalDispatch(id: number): Promise<DispatchLegal | null> {
    const dispatchDB = await invDispatchRepository.findOne({
      where: { id: id },
      relations: {
        items: {
          item: {
            product: {
              measure: true,
            },
            presentation: true,
          },
        },
        wareTo: true,
        wareFrom: true,
      },
    })
    const toIsWarehouse = dispatchDB?.wareTo?.type == WAREHOUSE_TYPE.STORE
    const fromIsWarehouse = dispatchDB?.wareFrom?.type == WAREHOUSE_TYPE.STORE
    let moveType = DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE
    if (toIsWarehouse && fromIsWarehouse)
      moveType = DISPATCH_MOVE_TYPE.STORE_TO_STORE

    if (!dispatchDB) return null
    const dispatch: DispatchLegal = {
      id: dispatchDB.id,
      approvedBy: dispatchDB.approvedBy,
      dispatchAt: dispatchDB.moveAt.split(' ')[0],
      wareFromName: dispatchDB.wareFrom?.name ?? '',
      wareToName: dispatchDB.wareTo?.name ?? '',
      gloss: dispatchDB.gloss,
      moveType,
      netValue: dispatchDB.netValue,
      numGuide: dispatchDB.numGuide ?? '',
      numInvoice: dispatchDB.numInvoice ?? '',
      status: dispatchDB.status as unknown as DISPATCH_STATUS,
      taxValue: dispatchDB.taxValue,
      totalValue: dispatchDB.totalValue,
      wareFromId: dispatchDB.wareFromId,
      wareToId: dispatchDB.wareToId,
      requestBy: dispatchDB.createdBy,

      driverDocumentNumber: dispatchDB.conductor_nro_doc ?? '',
      driverDocumentType: dispatchDB.conductor_tipo_doc ?? '',
      driverFirstName: dispatchDB.conductor_nombres ?? '',
      driverLastName: dispatchDB.conductor_apellidos ?? '',
      driverLicenseNumber: dispatchDB.conductor_nro_licencia ?? '',
      licensePlateNumber: dispatchDB.transporte_nro_placa ?? '',
      transportCompanyName: dispatchDB.transporte_razon_social ?? '',
      items:
        dispatchDB.items?.map(
          (el) =>
            ({
              id: el.id,
              dispatchId: dispatchDB.id,
              itemId: el.itemId,
              itemName: el.itemName,
              measureId:
                el.item?.product?.measureId ??
                el.item?.measureId ??
                el.measureId,
              measureCode: el.item?.product?.measure?.code ?? '',
              presentationId: el.item?.presentationId ?? el.presentationId,
              presentationName:
                el.item?.presentation?.presentation ??
                el.presentationName ??
                '',
              quantity: el.quantity,
              unitValue: el.unitValue,
              totalValue: el.totalValue,
            }) satisfies DispatchItem,
        ) ?? [],
    }
    return dispatch
  }
}
