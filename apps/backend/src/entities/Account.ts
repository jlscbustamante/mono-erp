import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'fin_account' })
export class Account {
  @PrimaryColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  account: string

  @Column({ type: 'smallint' })
  is_father: number

  @Column({ type: 'int' })
  father: number

  @Column({ type: 'char' })
  type: string

  @Column({ type: 'char' })
  level: string

  @Column({ type: 'smallint' })
  visible: string

  @Column({ type: 'smallint' })
  status: string

  @Column({ type: 'varchar' })
  created_by: string

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
