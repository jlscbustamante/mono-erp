import { badRequest } from '@hapi/boom'

import { In, Raw, Repository } from 'typeorm'
import { AppDataSource } from '../../config/database'
import {
  InvDispatch,
  InvDispatchStatus,
} from '../../entities/inventory/Dispatch'
import { invDispatchRepository } from '../../repositories/inventory/dispatch.repository'
import { productCategoryRepository } from '../../repositories/inventory/productCategory.respository'
import sucursalRepository from '../../repositories/sucursal.repository'
import { DispatchItems } from '../inventory/application/dispatch_items'
import { DispatchUpdateDto } from '../inventory/dto'
import {
  DISPATCH_MOVE_TYPE,
  DISPATCH_STATUS,
  DispatchSummary,
} from '../inventory/entities/dispatch'
import { DispatchRepository } from '../inventory/entities/repositories/dispatch.repository'

export class DispatchService {
  constructor(
    private readonly dispatchRepository: DispatchRepository,
    private readonly dispatchItems: DispatchItems,
    private readonly dispatchDBRepository: Repository<InvDispatch>,
  ) {}

  async getDispatch(id: number) {
    const dispatch = await this.dispatchRepository.getOne(id)
    if (!dispatch)
      throw badRequest('No se encontro el despacho con el id ' + id)

    return dispatch
  }

  async getDispatches(date: string) {
    const dispatches = await invDispatchRepository.find({
      where: {
        // moveType: DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE as any,
        moveType: In([
          DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE,
          DISPATCH_MOVE_TYPE.EXCEPTIONAL,
        ]),
        moveAt: Raw((alias) => `DATE(${alias}) = :date`, { date }),
      },
      relations: {
        wareFrom: true,
        wareTo: true,
      },
    })

    return dispatches
  }

  async updateDispatch(dispatch: DispatchUpdateDto) {
    if (
      dispatch.status != DISPATCH_STATUS.NEW &&
      dispatch.status != DISPATCH_STATUS.APPROVED
    ) {
      {
        throw badRequest(
          'No se puede actualizar el despacho, el estado debe ser Nuevo',
        )
      }
    }
    await this.dispatchRepository.saveDispatch(dispatch)
  }

  async simpleDispatch(
    dispatchId: number,
    user: string,
    date: string,
    wareFromId?: string,
  ) {
    const dispatch = await this.dispatchRepository.getOne(dispatchId)
    if (!dispatch) throw new Error('No se encontro el despacho')
    await this.dispatchItems.run(
      {
        ...dispatch,
        wareFromId: wareFromId ?? '',
        dispatchAt: date,
      } satisfies DispatchUpdateDto,
      user,
    )
  }

  async dispatchByRoute(date: string, route: string) {
    const dispatches = await this.dispatchRepository.getDispatchesRoute(
      date,
      route,
    )
    return dispatches
  }

  async dispatchConsolidation(start: string, end: string) {
    const dispatches = await this.dispatchDBRepository.find({
      select: {
        id: true,
        moveAt: true,
        items: {
          itemName: true,
          id: true,
          quantity: true,
          measureId: true,
          itemId: true,
          item: {
            id: true,
            product: {
              id: true,
              categoryId: true,
            },
          },
        },
      },
      where: {
        moveType: In([DISPATCH_MOVE_TYPE.WAREHOUSE_TO_STORE]) as any,
        moveAt: Raw((alias) => `DATE(${alias}) BETWEEN :start AND :end`, {
          start,
          end,
        }),
        wareTo: {
          type: 'T',
        },
        status: In([InvDispatchStatus.DISPATCHED, InvDispatchStatus.INVOICED]),
      },
      relations: {
        items: {
          item: {
            product: true,
          },
        },
        wareTo: true,
      },
    })

    // console.log(dispatches.filter((el) => (el.id = 3162)))
    const categories = await productCategoryRepository.find()

    // const result: DispatchSummary[] = []
    const record: {
      [itemId: number]: DispatchSummary
    } = {}

    for (const dispatch of dispatches) {
      if (dispatch.id == 3162) {
        console.log('rpeuab : ', dispatch)
      }
      const date = dispatch.moveAt.split(' ')[0]
      for (const item of dispatch.items ?? []) {
        const category = categories.find(
          (el) => el.id == item.item?.product?.categoryId,
        )

        if (!record[item.itemId]) {
          record[item.itemId] = {
            itemName: item.itemName,
            categoryId: item.item?.product?.categoryId ?? 0,
            categoryName: category?.category ?? '',
            itemId: item.itemId,
            dates: {},
          }
        }
        if (!record[item.itemId].dates[date]) {
          record[item.itemId].dates[date] = 0
        }

        record[item.itemId].dates[date] += item.quantity ?? 0
      }
    }

    return { dispatches: Object.values(record), dates: [start, end] }
  }

  async getConsolidateItem(date: string, itemId: number) {
    const sucursales = await sucursalRepository.find({})
    const data: { sucursal_to_id: string; cantidad: string; total: string }[] =
      await AppDataSource.query(
        `SELECT sucursal_to_id ,SUM(idi.quantity) cantidad,SUM(idi.total_value) total 
FROM inv_dispatch_item idi INNER JOIN inv_dispatch id ON idi.dispatch_id=id.id INNER JOIN adm_sucursal as2 ON as2.id=id.sucursal_to_id WHERE id.status IN(3,4) AND idi.item_id=? AND DATE(id.move_at)=? AND id.move_type IN("D") AND as2.type_sede="T"
GROUP BY id.sucursal_to_id`,
        [itemId, date],
      )

    const report = data
      .map((el) => {
        const sucursal = sucursales.find((suc) => suc.id == el.sucursal_to_id)

        return {
          storeCode: sucursal?.id ?? el.sucursal_to_id,
          storeName: sucursal?.title ?? el.sucursal_to_id,
          quantity: Number(el.cantidad),
          total: Number(el.total),
        }
      })
      .sort((a, b) => a.storeName.localeCompare(b.storeName))

    return report
  }
}
