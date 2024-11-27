import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../config/EntitiesTimestamps'
import { DateTransformer } from '../config/transformers/dateTransformer'
import { AccoutingMoveType } from '../types/accoutingMove'

@Entity({ name: 'accounting_move' })
export class AccoutingMove extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number | null

  @Column({ type: 'int' })
  move_id: number

  @Column({ type: 'enum', enum: AccoutingMoveType })
  move_type: AccoutingMoveType

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  move_at: string

  @Column({ type: 'varchar' })
  gloss: string

  @Column({ type: 'varchar' })
  num_doc: string

  @Column({ type: 'int' })
  cost_center_id: number

  @Column({ type: 'int' })
  status: number

  @Column({ type: 'varchar' })
  created_by: string
}
