import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'iam_function' })
export class IamFunction {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  module_id: number

  @Column({ type: 'int' })
  priority: number

  @Column({ type: 'smallint' })
  status: number

  @Column({ type: 'varchar' })
  path_function: string

  @Column({ type: 'varchar' })
  path_view: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  created_at: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  updated_at: string
}
