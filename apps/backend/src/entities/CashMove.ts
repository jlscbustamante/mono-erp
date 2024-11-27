import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'
import { DecimalTransformer } from '../config/transformers/decimalTransformer'
import { CashMoveFlow, CashMoveStatus } from '../types/cashMove'
import { Account } from './Account'
import { CashAccount } from './CashAccount'
import { Category } from './Category'

@Entity({ name: 'adm_cash_account_move' })
export class CashMove {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number | null

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'decimal', transformer: new DecimalTransformer() })
  amount: number

  @Column({ type: 'enum', enum: CashMoveFlow })
  account_flow: CashMoveFlow

  @Column({ type: 'int' })
  cash_id: number

  @Column({ type: 'int' })
  cash_account_id: number

  @Column({ type: 'int' })
  category_expense_id: number

  @Column({ type: 'int' })
  category_account_id: number

  @Column({ type: 'enum', enum: CashMoveStatus })
  status: CashMoveStatus

  @Column({ type: 'varchar' })
  created_by: string

  @Column({ type: 'varchar' })
  approved_by: string

  @Column({ type: 'varchar' })
  rejected_by: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  requested_at: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  approved_at: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  rejected_at: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  created_at: string

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  updated_at: string

  @ManyToOne(() => CashAccount)
  @JoinColumn({ name: 'cash_id' })
  cashAccount: CashAccount

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_expense_id' })
  category: Category | null

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'cash_account_id' })
  accountAE: Account | null

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'category_account_id' })
  categoryAccountAE: Account | null
}
