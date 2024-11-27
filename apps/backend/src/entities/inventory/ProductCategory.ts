import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { StatusEntityNumber } from '../../types'

@Entity({ name: 'inv_category' })
export class ProductCategory extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  category: string

  @Column({ type: 'tinyint' })
  priority: number

  @Column({ type: 'tinyint' })
  status: StatusEntityNumber
}
