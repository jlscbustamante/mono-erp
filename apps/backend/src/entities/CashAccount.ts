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
import { CashAccountStatus } from '../types/cashAccount'
import { Account } from './Account'

@Entity({ name: 'fin_cashbank' })
export class CashAccount {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', name: 'cashbank' })
  name: string

  @Column({ type: 'int' })
  account_id: number

  @Column({ type: 'int', name: 'type_cash' })
  type_cash_id: number

  @Column({ type: 'varchar', name: 'sucursal_id' })
  codefis: string

  roles_id: number

  @Column({ type: 'enum', enum: CashAccountStatus })
  status: CashAccountStatus

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

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account
}
