import { badRequest } from '@hapi/boom'

import { AppDataSource } from '../config/database'
import { InvDispatch } from '../entities/inventory/Dispatch'
import { IDispatchBase } from '../types/final'
import { dispatchBaseRepository } from './inventory/dispatchBase.repository'

export class DispatchRepository {
  async getListDispatchToday(date: string) {
    const query: { id: string; title: string; count: string }[] =
      await AppDataSource.query(
        `SELECT ads.id,ads.title,COUNT(idp.id) count FROM adm_sucursal ads LEFT JOIN inv_dispatch idp ON ads.id=idp.sucursal_to_id AND DATE(idp.move_at)=?
    GROUP BY ads.id, ads.title
    ORDER BY ads.title`,
        [date],
      )
    if (!query) return []
    return query.map((el) => ({ ...el, count: el.count })) ?? []
  }

  async getTemplates(): Promise<{ itemId: number; quantity: number }[]> {
    const items: IDispatchBase[] = await dispatchBaseRepository.likeId('PR')

    if (items.length == 0)
      throw badRequest(
        'No se genero el despacho porque no se encontro items en el template',
      )

    return items.map((el) => {
      return {
        itemId: el.item_id,
        quantity: Number(el.quantity),
      }
    })
  }
}
