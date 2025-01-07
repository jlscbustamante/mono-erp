import { badRequest } from '@hapi/boom'
import { parseISO } from 'date-fns'
import { InvDispatch, InvKardex, Item } from 'pizzadb'
// import { KARDEX_MOVE_FLOW } from 'shared'
import { In, Repository } from 'typeorm'
import { InvPurchase } from '../../entities/inventory/Purchase'
import { KARDEX_ORIGIN, KardexCreateDto } from './dto'

export enum KARDEX_MOVE_FLOW {
  IN = 'E',
  OUT = 'S',
}

export class KardexService {
  constructor(
    private readonly kardexRepository: Repository<InvKardex>,
    private readonly itemRepository: Repository<Item>,
    private readonly dispatchRepository: Repository<InvDispatch>,
    private readonly purchaseRepository: Repository<InvPurchase>,
  ) {}

  async generateFromDispatch(dispatchId: number, user: string) {
    try {
      const dispatch = await this.dispatchRepository.findOne({
        select: {
          id: true,
          moveAt: true,
          wareToId: true,
          wareFromId: true,
          numInvoice: true,
          items: {
            id: true,
            itemId: true,
            unitValue: true,
            quantity: true,
          },
        },
        where: { id: dispatchId },
        relations: {
          items: true,
        },
      })
      const itemIds = dispatch?.items?.map((el) => el.itemId) ?? []
      if (!dispatch?.items || dispatch.items.length == 0 || itemIds.length == 0)
        throw new Error('Despacho invalido, no se encontro o no tiene items')
      const items = await this.itemRepository.find({
        where: {
          id: In(itemIds),
        },
        relations: {
          presentation: true,
        },
      })

      const kardex: InvKardex[] = []
      for (const dispatchItem of dispatch.items) {
        const itemDb = items.find((el) => el.id == dispatchItem.itemId)
        if (itemDb) {
          const kardexCreateIn: KardexCreateDto = {
            itemId: dispatchItem.itemId,
            createdBy: user || 'sys',
            moveAt: dispatch.moveAt.split(' ')[0],
            warehouseId: dispatch.wareToId,
            moveType: KARDEX_MOVE_FLOW.IN,
            numDoc: dispatch.numInvoice,
            origin: KARDEX_ORIGIN.DISPATCH,
            originId: dispatch.id,
            quantity: dispatchItem.quantity,
            purchasePrice: dispatchItem.unitValue,
            typeDoc: null,
          }

          const kardexCreateOut: KardexCreateDto = {
            itemId: dispatchItem.itemId,
            createdBy: user || 'sys',
            moveAt: dispatch.moveAt.split(' ')[0],
            warehouseId: dispatch.wareFromId,
            moveType: KARDEX_MOVE_FLOW.OUT,
            numDoc: dispatch.numInvoice,
            origin: KARDEX_ORIGIN.DISPATCH,
            originId: dispatch.id,
            quantity: dispatchItem.quantity,
            purchasePrice: dispatchItem.unitValue,
            typeDoc: null,
          }

          const itemKardexIn = this.syncDtoToEntity(kardexCreateIn, itemDb)
          const itemKardexOut = this.syncDtoToEntity(kardexCreateOut, itemDb)

          kardex.push(itemKardexIn, itemKardexOut)
        }
      }

      await this.kardexRepository.save(kardex)
    } catch (err) {
      console.log('[KARDEX][despacho]: ' + dispatchId, err)
    }
  }

  async generateFromPurchase(purchaseId: number, user: string) {
    try {
      const purchase = await this.purchaseRepository.findOne({
        where: {
          id: purchaseId,
        },
        relations: {
          items: {
            item: true,
          },
        },
      })
      if (!purchase) throw new Error('No se encontro la compra')
      if (!purchase.warehouseId)
        throw new Error('No se encontro el almacen destino en la compra')

      const kardexList: InvKardex[] = []
      for (const item of purchase?.items ?? []) {
        if (item.item) {
          const kardex: KardexCreateDto = {
            itemId: item.itemId,
            createdBy: user || 'sys',
            moveAt: purchase.purchaseAt.split(' ')[0],
            warehouseId: purchase.warehouseId,
            moveType: KARDEX_MOVE_FLOW.IN,
            numDoc: purchase.numInvoice,
            origin: KARDEX_ORIGIN.PURCHASE,
            originId: purchase.id,
            quantity: item.quantity,
            purchasePrice: item.unitValue,
            typeDoc: null,
          }

          const itemKardex = this.syncDtoToEntity(kardex, item.item)

          kardexList.push(itemKardex)
        }
      }

      await this.kardexRepository.save(kardexList)
    } catch (err) {
      console.log('[KARDEX][compra]: ' + purchaseId, err)
    }
  }

  async registerKardex(items: KardexCreateDto | KardexCreateDto[]) {
    if (Array.isArray(items)) {
      await this.createMultipleKardex(items)
    } else {
      await this.createKardex(items)
    }
  }

  private async createMultipleKardex(items: KardexCreateDto[]) {
    const kardexs: InvKardex[] = []

    for (const item of items) {
      const kardex = await this.dtoToEntity(item)
      kardexs.push(kardex)
    }

    await this.kardexRepository.save(kardexs)
  }

  private async createKardex(kardexDto: KardexCreateDto) {
    const kardex = await this.dtoToEntity(kardexDto)
    await this.kardexRepository.save(kardex)
  }

  private async dtoToEntity(kardexDto: KardexCreateDto) {
    const kardex = new InvKardex()
    const item = await this.itemRepository.findOne({
      where: { id: kardexDto.itemId },
      relations: {
        presentation: true,
      },
    })

    if (!item) throw badRequest('Item no encontrado')

    kardex.item_id = item.id
    kardex.item_name = item.itemName
    kardex.presentation_id = item.presentationId
    kardex.presentation_name = item.presentation.presentation
    kardex.move_type = kardexDto.origin
    kardex.move_id = kardexDto.originId
    kardex.move_flow = kardexDto.moveType
    kardex.type_doc = kardexDto.typeDoc ?? ''
    kardex.num_doc = kardexDto.numDoc ?? ''
    kardex.warehouse_id = kardexDto.warehouseId
    kardex.move_at = parseISO(kardexDto.moveAt)
    kardex.quantity = kardexDto.quantity
    kardex.unit_purchase = kardexDto.purchasePrice ?? item.unitCost
    kardex.unit_price = item.unitPrice
    kardex.total_price = item.unitCost * kardexDto.quantity

    return kardex
  }

  private syncDtoToEntity(kardexDto: KardexCreateDto, item: Item) {
    const kardex = new InvKardex()

    const price = kardexDto.purchasePrice ?? item.unitCost

    kardex.item_id = item.id
    kardex.item_name = item.itemName
    kardex.presentation_id = item.presentationId
    kardex.presentation_name = item.presentation.presentation
    kardex.move_type = kardexDto.origin
    kardex.move_id = kardexDto.originId
    kardex.move_flow = kardexDto.moveType
    kardex.type_doc = kardexDto.typeDoc ?? ''
    kardex.num_doc = kardexDto.numDoc ?? ''
    kardex.warehouse_id = kardexDto.warehouseId
    kardex.move_at = parseISO(kardexDto.moveAt)
    kardex.quantity = kardexDto.quantity
    kardex.unit_purchase = price
    kardex.unit_price = item.unitPrice
    kardex.total_price = price * kardexDto.quantity

    return kardex
  }
}
