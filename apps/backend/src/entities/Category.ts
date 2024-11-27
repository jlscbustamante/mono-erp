import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import {
  CategoryAccountFlow,
  CategoryStatus,
  CategoryTypeMove,
} from '../types/category'
import { Account } from './Account'
import { CategoryType } from './CategoryType'

@Entity({ name: 'adm_category_expense' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'int' })
  account_id: number

  @Column({ type: 'int' })
  type_category_id: number

  @Column({ type: 'enum', enum: CategoryAccountFlow })
  account_flow: CategoryAccountFlow

  @Column({ type: 'varchar' })
  cash_flow: string

  @Column({ type: 'enum', enum: CategoryTypeMove })
  type_mov: CategoryTypeMove

  @Column({ type: 'int' })
  roles_id: number

  @Column({ type: 'int' })
  m_order: number

  @Column({ type: 'int' })
  codEfis: number

  @Column({ type: 'enum', enum: CategoryStatus })
  status: CategoryStatus

  @ManyToOne(() => CategoryType)
  @JoinColumn({ name: 'type_category_id' })
  categoryType: CategoryType

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_id' })
  account: Account
}
