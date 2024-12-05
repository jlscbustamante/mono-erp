import { badRequest } from '@hapi/boom'
import { parseISO } from 'date-fns'
import { InvDispatch, Item } from 'pizzadb'
import { In, Repository } from 'typeorm'
import { InvKardex } from '../../entities/inventory/InvKardex'
import { InvPurchase } from '../../entities/inventory/Purchase'
import { KARDEX_MOVE_TYPE, KARDEX_ORIGIN, KardexCreateDto } from './dto'

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
            moveType: KARDEX_MOVE_TYPE.IN,
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
            moveType: KARDEX_MOVE_TYPE.OUT,
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
            moveType: KARDEX_MOVE_TYPE.IN,
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

    kardex.itemId = item.id
    kardex.itemName = item.itemName
    kardex.presentationId = item.presentationId
    kardex.presentationName = item.presentation.presentation
    kardex.moveType = kardexDto.origin
    kardex.moveId = kardexDto.originId
    kardex.moveFlow = kardexDto.moveType
    kardex.typeDoc = kardexDto.typeDoc
    kardex.numDoc = kardexDto.numDoc
    kardex.warehouseId = kardexDto.warehouseId
    kardex.moveAt = parseISO(kardexDto.moveAt)
    kardex.quantity = kardexDto.quantity
    kardex.unitPurchase = kardexDto.purchasePrice ?? item.unitCost
    kardex.unitPrice = item.unitPrice
    kardex.totalPrice = item.unitCost * kardexDto.quantity

    return kardex
  }

  private syncDtoToEntity(kardexDto: KardexCreateDto, item: Item) {
    const kardex = new InvKardex()

    const price = kardexDto.purchasePrice ?? item.unitCost

    kardex.itemId = item.id
    kardex.itemName = item.itemName
    kardex.presentationId = item.presentationId
    kardex.presentationName = item.presentation.presentation
    kardex.moveType = kardexDto.origin
    kardex.moveId = kardexDto.originId
    kardex.moveFlow = kardexDto.moveType
    kardex.typeDoc = kardexDto.typeDoc
    kardex.numDoc = kardexDto.numDoc
    kardex.warehouseId = kardexDto.warehouseId
    kardex.moveAt = parseISO(kardexDto.moveAt)
    kardex.quantity = kardexDto.quantity
    kardex.unitPurchase = price
    kardex.unitPrice = item.unitPrice
    kardex.totalPrice = price * kardexDto.quantity

    return kardex
  }
}
