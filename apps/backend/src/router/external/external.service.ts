import { badRequest } from '@hapi/boom'
import { Raw } from 'typeorm'

import { InvDispatch, InvDispatchStatus, InvStock } from 'pizzadb'
import { invDispatchRepository } from '../../repositories/inventory/dispatch.repository'
import { invStockRepository } from '../../repositories/inventory/invStock.repository'
import { productItemRepository } from '../../repositories/inventory/item.repository'

export class ExternalService {
  /**
   *
   * @description Items para sipro(sistema externo), no deprecar
   */
  async getItemsSipro() {
    const items = await productItemRepository.find({
      select: {
        id: true,
        itemName: true,
      },
    })
    return items
  }

  async createStock(stock: InvStock) {
    await invStockRepository.insert(stock)
  }

  async upodateStock(stock: InvStock) {
    await invStockRepository.update(stock.id, stock)
  }

  async deleteStock(stockId: number) {
    await invStockRepository.delete(stockId)
  }

  async getStock(stockId: number) {
    const stock = await invStockRepository.findOne({
      where: {
        id: stockId,
      },
    })

    if (!stock) throw badRequest('No se econtro el stock con id ' + stockId)

    return stock
  }

  async getStocksBySucursal(
    sucursalCode: string,
    stock_at?: string,
    dispatch_at?: string,
  ) {
    const dispatchAt = dispatch_at ? dispatch_at : stock_at
    const stock = await invStockRepository.find({
      select: {
        item: {
          id: true,
          product: {
            id: true,
            category: {
              id: true,
              category: true,
            },
            measure: {
              id: true,
              measure: true,
              code: true,
            },
          },
        },
      },
      where: {
        warehouse_id: sucursalCode,
        stock_at: stock_at
          ? Raw((alias) => `DATE(${alias}) = '${stock_at}'`)
          : undefined,
      },
      order: {
        item_name: 'ASC',
      },
      relations: {
        item: {
          product: {
            category: true,
          },
        },
      },
    })
    let dispatch: InvDispatch[] = []
    if (dispatchAt) {
      dispatch = await invDispatchRepository.find({
        where: {
          moveAt: dispatchAt
            ? Raw((alias) => `DATE(${alias}) = '${dispatchAt}'`)
            : undefined,
          wareToId: sucursalCode,
          status: InvDispatchStatus.DISPATCHED,
        },
        order: {
          moveAt: 'DESC',
        },
        relations: {
          items: true,
        },
      })
    }
    const recordDispatchByItem: Record<number, number> = {}
    for (const dispatchOne of dispatch) {
      dispatchOne.items?.forEach((el) => {
        if (!el) return
        if (!recordDispatchByItem[el.itemId]) {
          recordDispatchByItem[el.itemId] = 0
        }
        recordDispatchByItem[el.itemId] += Number(el.quantity)
      })
    }

    if (!stock)
      throw badRequest('No se econtro el stock con id ' + sucursalCode)

    return stock.map((el) => {
      const dispatchedItem = recordDispatchByItem[el.item_id] || 0
      return {
        ...el,
        categoryId: el.item.product?.category?.id,
        categoryName: el.item.product?.category?.category,
        item: undefined,
        dispatched: dispatchedItem,
        hidata: el.item.product?.measure?.code ?? 'nada',
      }
    })
  }

  async hasStock(code: string) {
    const stock = await invStockRepository.findOne({
      where: {
        warehouse_id: code,
      },
    })

    return !!stock
  }
}
