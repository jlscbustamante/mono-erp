import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../config/EntitiesTimestamps'

@Entity({ name: 'accounting_item' })
export class AccoutingItem extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number | null

  @Column({ type: 'int' })
  move_id: number

  @Column({ type: 'int' })
  account_id: number

  @Column({ type: 'varchar' })
  account_name: string

  @Column({ type: 'decimal', precision: 16, scale: 2 })
  amount_debit: number

  @Column({ type: 'decimal', precision: 16, scale: 2 })
  amount_credit: number

  @Column({ type: 'int' })
  cash_account_move_id: number
}
