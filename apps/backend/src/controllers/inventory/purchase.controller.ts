import { Request, Response } from 'express'

import { badRequest } from '@hapi/boom'
import config from '../../config/config'
import { AppDataSource } from '../../config/database'
import { CATEGORY_ID_PAGO_PROVEEDORES, PARAMETERS } from '../../const'
import { AccoutingItem } from '../../entities/AccoutingItem'
import { AccoutingMove } from '../../entities/AccoutingMove'
import { InvPurchase } from '../../entities/inventory/Purchase'
import { InvPurchaseItem } from '../../entities/inventory/PurchaseItem'
import { RequestEntity } from '../../entities/Request'
import categoryRepository from '../../repositories/category.repository'
import { invPurchaseRepository } from '../../repositories/inventory/purchase.repository'
import { invSupplierRepository } from '../../repositories/inventory/supplier.repository'
import { IToken } from '../../types'
import { AccoutingMoveType } from '../../types/accoutingMove'
import { IUserFilter3 } from '../../types/filter'
import {
  RequestAccountFlow,
  RequestStatus,
  RequestType,
} from '../../types/request'
import { catchError } from '../../utils/decorators'

export class PurchaseController {
  @catchError
  async getPurchases(req: Request, res: Response): Promise<void> {
    const filters = req.body as IUserFilter3<InvPurchase>
    const {
      data: purchases,
      count,
      totalPages: totalPage,
    } = await invPurchaseRepository.filter3(filters)

    res.json({
      data: {
        purchases,
        count,
        totalPage,
      },
    })
  }

  @catchError
  async createPurchase(req: Request, res: Response) {
    const token: IToken = req.headers.token as unknown as IToken
    const purchase: InvPurchase = req.body
    purchase.createdBy = token.name

    // crear requerimiento

    const { itemCredit, itemDebit, move } =
      await PurchaseController.getAccoutingObjects(purchase, token)

    const categoryProvider = await categoryRepository.findOneBy({
      id: CATEGORY_ID_PAGO_PROVEEDORES,
    })
    const supplier = await invSupplierRepository.findOneBy({
      id: purchase.supplierId,
    })
    if (!categoryProvider && config.purchasegeneratederivate) {
      throw new Error(
        `Categoría de proveedores no encontrada ${CATEGORY_ID_PAGO_PROVEEDORES}`,
      )
    }

    const requirement = new RequestEntity()
    requirement.id = null
    requirement.request_type = RequestType.Supplier
    // requirement.description = purchase.gloss
    requirement.description = `${purchase.supplierName} ${purchase.numInvoice}`
    if (purchase.numInvoice) requirement.num_document = purchase.numInvoice
    requirement.requested_at = purchase.purchaseAt
    requirement.status = RequestStatus.Pending
    requirement.amount = purchase.totalValue
    requirement.created_by = purchase.createdBy
    requirement.category_id = CATEGORY_ID_PAGO_PROVEEDORES
    requirement.category_account_id = categoryProvider?.account_id ?? -1
    requirement.account_flow =
      categoryProvider?.account_flow as unknown as RequestAccountFlow
    if (supplier) {
      requirement.legal_name = supplier.legalName
      requirement.legal_number = supplier.legalNumber
    }
    // TERMINAR DE CREAR REQ

    await AppDataSource.transaction(async (manager) => {
      const result = await manager.insert(InvPurchase, purchase)
      const items = purchase.items as InvPurchaseItem[]
      for (const item of items) {
        item.purchaseId = result.raw.insertId
      }
      await manager.insert(InvPurchaseItem, items)

      if (config.purchasegeneratederivate) {
        // GUARDAR REQ
        move.move_id = result.raw.insertId
        const resultMove = await manager.insert(AccoutingMove, move)
        itemCredit.move_id = resultMove.raw.insertId
        itemDebit.move_id = resultMove.raw.insertId
        await manager.insert(AccoutingItem, [itemCredit, itemDebit])

        requirement.purchaseId = result.raw.insertId

        await manager.insert(RequestEntity, requirement)
      }

      // FIN GUARDAR REQ
    })
    res.json({
      message: 'Creado correctamente',
    })
  }

  @catchError
  async createRequirementFromPurchase(req: Request, res: Response) {
    const { id } = req.body as { id: number }
    const purchase = await invPurchaseRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        items: true,
      },
    })
    if (!purchase) {
      throw badRequest('Requisición no encontrada')
    }

    const { itemCredit, itemDebit, move } =
      await PurchaseController.getAccoutingObjects(purchase, {
        name: 'admin',
      } as IToken)

    const categoryProvider = await categoryRepository.findOneBy({
      id: CATEGORY_ID_PAGO_PROVEEDORES,
    })
    const supplier = await invSupplierRepository.findOneBy({
      id: purchase.supplierId,
    })
    if (!categoryProvider) {
      throw new Error(
        `Categoría de proveedores no encontrada ${CATEGORY_ID_PAGO_PROVEEDORES}`,
      )
    }

    const requirement = new RequestEntity()
    requirement.id = null
    requirement.request_type = RequestType.Supplier
    requirement.description =
      purchase.gloss == ''
        ? `Compra ${purchase.numInvoice ?? ''}`
        : purchase.gloss
    if (purchase.numInvoice) requirement.num_document = purchase.numInvoice
    requirement.requested_at = purchase.purchaseAt
    requirement.status = RequestStatus.Pending
    requirement.amount = purchase.totalValue
    requirement.created_by = purchase.createdBy
    requirement.category_id = CATEGORY_ID_PAGO_PROVEEDORES
    requirement.category_account_id = categoryProvider.account_id
    requirement.account_flow =
      categoryProvider.account_flow as unknown as RequestAccountFlow
    if (supplier) {
      requirement.legal_name = supplier.legalName
      requirement.legal_number = supplier.legalNumber
    }

    await AppDataSource.transaction(async (manager) => {
      move.move_id = purchase.id
      const resultMove = await manager.insert(AccoutingMove, move)
      itemCredit.move_id = resultMove.raw.insertId
      itemDebit.move_id = resultMove.raw.insertId
      await manager.insert(AccoutingItem, [itemCredit, itemDebit])

      requirement.purchaseId = purchase.id

      await manager.insert(RequestEntity, requirement)
    })

    return res.json({
      message: 'ok',
      invoice: purchase.numInvoice,
    })
  }

  @catchError
  async createWarehouse(req: Request, res: Response) {
    res.json({
      message: 'Creado correctamente',
    })
  }

  static async getAccoutingObjects(purchase: InvPurchase, token: IToken) {
    const accounts: { id: number; account: string; name: string }[] =
      await AppDataSource.query(
        `SELECT ac.id,ac.account,par.name FROM account ac INNER JOIN parameters par ON par.value=ac.id
    WHERE par.type=?`,
        [PARAMETERS.ASIENTO_COMPRA],
      )
    const cuentaCargo = accounts.find((ac) => ac.name == 'CUENTA_CARGO')
    const cuentaAbono = accounts.find((ac) => ac.name == 'CUENTA_ABONO')
    if (!cuentaCargo || !cuentaAbono) {
      throw new Error(
        `Cuenta de cargo o abono no encontrada para ${PARAMETERS.ASIENTO_COMPRA}`,
      )
    }

    const move = new AccoutingMove()
    move.move_type = AccoutingMoveType.Purchase
    move.move_at = purchase.purchaseAt
    move.gloss = purchase.gloss
    move.num_doc = purchase.numInvoice ?? ''
    move.created_by = token.name
    move.status = 1
    move.cost_center_id = 0
    // cargo es debit
    const itemDebit = new AccoutingItem()
    itemDebit.account_id = cuentaCargo.id
    itemDebit.account_name = cuentaCargo.account
    itemDebit.amount_debit = purchase.totalValue
    itemDebit.amount_credit = 0

    const itemCredit = new AccoutingItem()
    itemCredit.account_id = cuentaAbono.id
    itemCredit.account_name = cuentaAbono.account
    itemCredit.amount_debit = 0
    itemCredit.amount_credit = purchase.totalValue

    return {
      move,
      itemDebit,
      itemCredit,
    }
  }
}
