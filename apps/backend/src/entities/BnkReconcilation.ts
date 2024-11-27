import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'
import { DecimalTransformer } from '../config/transformers/decimalTransformer'

@Entity({ name: 'bnk_reconciliation' })
export class BankReconciliation {
  @PrimaryColumn({ type: 'varchar' })
  transactionkey: string

  @Column({ type: 'varchar' })
  bnk_name: string

  @Column({
    type: 'datetime',
    transformer: new DateTransformer(),
    name: 'bnk_fecha',
  })
  bnk_date: string

  @Column({ type: 'varchar', name: 'bnk_operacion_text' })
  bnk_operation_text: string

  @Column({ type: 'varchar', name: 'bnk_operacion_num' })
  bnk_operation_num: string

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    name: 'bnk_monto',
  })
  bnk_amount: number

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    name: 'bnk_saldo',
  })
  bnk_balance: number

  @Column({ type: 'varchar', name: 'bnk_agencia' })
  bnk_agency: string

  @Column({ type: 'varchar', name: 'bnk_usuario' })
  bnk_user: string

  @Column({ type: 'varchar' })
  bnk_utc: string

  @Column({ type: 'varchar', name: 'bnk_referencia' })
  bnk_reference: string

  @Column({ type: 'int', nullable: true })
  req_id: number | null

  @Column({ type: 'varchar' })
  req_description: string

  @Column({ type: 'decimal', name: 'req_monto', precision: 2 })
  req_amount: number

  @Column({ type: 'varchar' })
  updated_by: string

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
}
