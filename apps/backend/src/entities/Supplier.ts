import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'supplier' })
export class Supplier {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  supplier: string

  @Column({ type: 'varchar' })
  legal_name: string

  @Column({ type: 'varchar' })
  legal_number: string

  @Column({ type: 'varchar' })
  address: string

  @Column({ type: 'varchar' })
  legal_account_bco: string

  @Column({ type: 'varchar' })
  legal_account_num: string

  @Column({ type: 'varchar' })
  legal_account_cci: string

  @Column({ type: 'varchar' })
  legal_account_cur: string

  @Column({ type: 'varchar' })
  legal_account_type: string

  @Column({ type: 'tinyint' })
  status: boolean

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
