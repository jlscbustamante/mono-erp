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
import { CashAccountType } from './CashAccountType'

@Entity({ name: 'adm_cash_account' })
export class CashAccount {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  account_id: number

  @Column({ type: 'int' })
  type_cash_id: number

  @Column({ type: 'varchar', name: 'sucursal_id' })
  codefis: string

  @Column({ type: 'int' })
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

  @ManyToOne(() => CashAccountType)
  @JoinColumn({ name: 'type_cash_id' })
  cash_account_type: CashAccountType

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account
}
