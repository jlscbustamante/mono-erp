import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Presentation } from 'pizzadb'
import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'

@Entity({ name: 'inv_equivalence' })
export class Equivalance extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  presentation_from: number

  @Column({ type: 'int', name: 'presentation_to' })
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

  @ManyToOne(() => Presentation)
  @JoinColumn({ name: 'presentation_to' })
  measure: Presentation
}
