import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'iam_module' })
export class IamModule {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  status: number

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
