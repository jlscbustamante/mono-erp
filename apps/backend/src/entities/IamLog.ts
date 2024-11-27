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

  @Column({ type: 'int' })
  module_id: number

  @Column({ type: 'varchar' })
  action: string

  @Column({ type: 'text', width: 6 })
  script: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  created_at: string
}
