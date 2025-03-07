import type { Request } from 'express'
import Joi from 'joi'
import { Fillime, InvDispatch, Item, Sucursal } from 'pizzadb'
import { validateToken } from '../../middleware/jwt/validateToken'
import { parseFilters } from '../../middleware/parse-filter.middleware'
import validateSchema from '../../middleware/validators/validateSchema'
import { IToken } from '../../types'
import { Delete, Get, Put } from '../../utils/decorators/endpoint.middleware'
import { InventoryService } from './inventory.service'

export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/inventory/order')
  async createOrder() {
    return this.inventoryService.createOrder()
  }

  @Get('/inventory/stock/edit')
  async getStockEditTemplate(req: Request) {
    const { store, date } = req.query as { store: string; date: string }

    return this.inventoryService.getStockToEdit(store, date)
  }

  @Get('/inventory/template/items')
  async getItemsTemplate(req: Request) {
    const { company } = req.query as { company?: string }
    const searchCompany = company || 'PIZZARAUL'
    const data = await this.inventoryService.getItemsTemplate(searchCompany)
    return data
  }

  @Get('/inventory/template/dispatch')
  async getDispatchTemplate(req: Request) {
    const { company = 'PIZZARAUL', sucursalCode } = req.query as {
      sucursalCode: string
      company?: string
    }

    const data = await this.inventoryService.getDispatchTemplate(
      sucursalCode,
      company,
    )

    return data
  }

  @Get('/inventory/sucursales')
  async sucursales() {
    return this.inventoryService.sucursales()
  }

  @Get('/inventory/items/filter', parseFilters)
  async filterItems(req: Request) {
    const data = req.body as Fillime<Item>
    return this.inventoryService.filterItems(data)
  }

  @Get('/inventory/sucursal/filter', parseFilters)
  async filterSucursal(req: Request) {
    const data = req.body as Fillime<Sucursal>
    return this.inventoryService.filterSucursal(data)
  }

  @Get('/inventory/dispatch/filter', parseFilters)
  async filterDispatch(req: Request) {
    const data = req.body as Fillime<InvDispatch>
    return this.inventoryService.filterDispatch(data)
  }

  @Delete(
    '/inventory/dispatch/cancel-invoice',
    validateToken,
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
        motivo: Joi.string().required(),
      }),
      'body',
    ),
  )
  async deleteInvoice(req: Request) {
    const data = req.body as { id: number; motivo: string }
    return this.inventoryService.cancelInvoice(data.id, data.motivo)
  }

  @Put(
    '/inventory/dispatch/duplicate',
    validateToken,
    validateSchema(
      Joi.object({
        id: Joi.number().required(),
      }),
    ),
  )
  async duplicateDispatch(req: Request) {
    const { id } = req.body as { id: string }
    const token = req.headers.token as unknown as IToken
    return this.inventoryService.duplicateDispatch(+id, token?.name)
  }
}
