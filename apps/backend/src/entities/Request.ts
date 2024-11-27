import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../config/EntitiesTimestamps'
import { DateTransformer } from '../config/transformers/dateTransformer'
import { DecimalTransformer } from '../config/transformers/decimalTransformer'
import {
  RequestAccountFlow,
  RequestCategoryType,
  RequestStatus,
  RequestType,
} from '../types/request'
import { Account } from './Account'
import { CashAccount } from './CashAccount'
import { Category } from './Category'
import { CostCenter } from './CostCenter'

@Entity({ name: 'adm_request' })
export class RequestEntity extends EntitiesTimeStamps {
  @PrimaryColumn({ type: 'int' })
  id: number | null

  @Column({ type: 'enum', enum: RequestType })
  request_type: RequestType

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'int', name: 'purchase_id' })
  purchaseId: number | null

  @Column({ type: 'varchar' })
  legal_number: string

  @Column({ type: 'varchar' })
  legal_name: string

  @Column({ type: 'varchar' })
  num_document: string

  @Column({ type: 'char' })
  retention: '0' | '1'

  @Column({
    type: 'decimal',
    precision: 2,
    transformer: new DecimalTransformer(),
  })
  amount: number

  @Column({
    type: 'decimal',
    precision: 2,
    transformer: new DecimalTransformer(),
  })
  amount_net: number

  @Column({
    type: 'decimal',
    precision: 2,
    transformer: new DecimalTransformer(),
  })
  amount_ret: number

  @Column({ type: 'varchar' })
  doc_url: string | null

  @Column({ type: 'enum', enum: RequestAccountFlow })
  account_flow: RequestAccountFlow

  @Column({ type: 'int' })
  category_id: number

  @Column({ type: 'int' })
  category_account_id: number

  @Column({ type: 'enum', enum: RequestCategoryType })
  category_move: RequestCategoryType

  @Column({ type: 'int' })
  cash_id: number

  @Column({ type: 'int' })
  cash_account_id: number

  @Column({ type: 'int' })
  cost_center_id: number

  @Column({ type: 'enum', enum: RequestStatus })
  status: RequestStatus

  @Column({ type: 'varchar' })
  created_by: string

  @Column({ type: 'varchar' })
  approved_by: string

  @Column({ type: 'varchar' })
  rejected_by: string

  @Column({
    type: 'datetime',
    transformer: new DateTransformer(),
  })
  requested_at: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  approved_at: string | null

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  rejected_at: string

  @ManyToOne(() => CashAccount)
  @JoinColumn({ name: 'cash_id' })
  cashAccount: CashAccount | null

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category | null

  @ManyToOne(() => CashAccount)
  @JoinColumn({ name: 'category_id' })
  cashAccountCategory: CashAccount | null

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  costCenter: CostCenter | null

  // cuentas para asientos contables
  @ManyToOne(() => Account)
  @JoinColumn({ name: 'cash_account_id' })
  cashAccountAE: Account | null

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'category_account_id' })
  cashAccountCategoryAE: Account | null

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'category_account_id' })
  categoryAccountAE: Account | null
}
