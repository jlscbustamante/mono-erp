import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { StatusEntityNumber } from '../../types'

@Entity({ name: 'inv_presentation' })
export class Presentation extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  presentation: string

  @Column({ type: 'smallint' })
  status: StatusEntityNumber
}
