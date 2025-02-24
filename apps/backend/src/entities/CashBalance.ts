import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'
import { DecimalTransformer } from '../config/transformers/decimalTransformer'
import { BalanceStatus } from '../types/balance'

@Entity({
  name: 'fin_cashbank_balance',
})
export class CashBalance {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number | null

  @Column({
    type: 'int',
  })
  cash_account_id: number

  @Column({
    type: 'int',
  })
  cash_id: number

  @Column({
    type: 'decimal',
    precision: 2,
    transformer: new DecimalTransformer(),
  })
  balance: number

  @Column({
    type: 'datetime',
    transformer: new DateTransformer(),
  })
  balance_at: string

  @Column({
    type: 'enum',
    enum: BalanceStatus,
  })
  status_request: BalanceStatus

  @Column({ type: 'varchar' })
  created_by: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  created_at: string
}
