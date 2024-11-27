import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { StatusEntityNumber } from '../../types'
import { Measure } from './Measure'
import { Presentation } from './Presentation'

@Entity({ name: 'inv_equivalence' })
export class Equivalance extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  presentation_from: number

  @Column({ type: 'int' })
  measure_to: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  value_from: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  value_factor: number

  @Column({ type: 'smallint' })
  status: 0 | 1

  @ManyToOne(() => Presentation)
  @JoinColumn({ name: 'presentation_from' })
  presentation: Presentation

  @ManyToOne(() => Measure)
  @JoinColumn({ name: 'measure_to' })
  measure: Presentation
}
