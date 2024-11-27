import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { StatusEntityNumber } from '../../types'

@Entity({ name: 'inv_measure' })
export class Measure extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50 })
  measure: string

  @Column({ type: 'varchar', length: 5 })
  code: string

  @Column({ type: 'tinyint' })
  status: StatusEntityNumber
}
