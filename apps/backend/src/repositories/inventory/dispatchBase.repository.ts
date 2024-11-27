import { Repository } from 'typeorm'

import { AppDataSource } from '../../config/database'
import { DispatchBase } from '../../entities/inventory/DispatchBase'
import { Filter3Method } from '../../types/filter'
import { filter3Base } from '../filter3base'

// export type DispatchBaseRepository = {
//   // filter3: Filter3Method<DispatchBase>
// }

export class DispatchBaseRepository {
  async likeId(type: string) {
    const templates = await AppDataSource.query(`SELECT *
FROM \`inv_dispatch_base\` \`dispatch\`
WHERE id LIKE("%${type}%");`)

    return templates
  }

  async getTemplatesForPos(type: string) {
    const queryIds = (await AppDataSource.query(
      `SELECT DISTINCT db.item_id itemId FROM \`inv_dispatch_base\` db WHERE id LIKE("%${type}%")`,
    )) as { itemId: number }[]
    const itemIds = queryIds.map((el) => el.itemId)

    const template = await AppDataSource.query(
      `SELECT ii.id itemId,ii.item_name itemName, 1 quantity,im.code measureCode,ii.unit_price unitPrice FROM inv_item ii LEFT JOIN inv_product ip ON ii.product_id=ip.id
    LEFT JOIN inv_measure im ON ip.measure_id=im.id
    WHERE ii.id IN(?) ORDER BY itemName`,
      [itemIds],
    )

    /*
    {
			"id": "PR20230423",
			"product_id": 2168,
			"item_id": 12,
			"item_name": "producto14 - Nueva marca - presentatacion2",
			"measure_id": 6,
			"presentation_id": 3,
			"unit_value": "45.00",
			"quantity": "1.00",
			"total_value": "45.00"
		}
    */

    return template
  }
}
export const dispatchBaseRepository = new DispatchBaseRepository()
