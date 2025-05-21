import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'iam_log' })
export class IamLog {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'int' })
  user_id: number

  @Column({ type: 'varchar' })
  user_name: string

  @Column({ type: 'varchar' })
  user_email: string

  @Column({ type: 'int' })
  module_id: number

  @Column({ type: 'varchar' })
  module_name: string

  @Column({ type: 'varchar' })
  action: string

  @Column({ type: 'varchar' })
  tbl_name: string

  @Column({ type: 'int' })
  tbl_primary_id: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  created_at: string
}
