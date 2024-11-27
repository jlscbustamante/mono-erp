import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'iam_user' })
export class IamUser {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', length: 150 })
  name: string

  @Column({ type: 'varchar', length: 250 })
  email: string

  @Column({ type: 'text' })
  password: string

  @Column({ type: 'int' })
  rol_id: number

  @Column({ type: 'text' })
  email_token: string

  @Column({ type: 'char', length: 1 })
  email_validate: string

  @Column({ type: 'smallint' })
  status: number

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: new DateTransformer(),
  })
  created_at: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    transformer: new DateTransformer(),
  })
  updated_at: string
}
