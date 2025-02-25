import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'
import { CostCenterStatus } from '../types/costCenter'
import { Account } from './Account'

@Entity({ name: 'fin_costcenter' })
export class CostCenter {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', name: 'costcenter' })
  origin: string

  @Column({ type: 'int', name: 'account_link1' })
  account_caja: number

  @Column({ type: 'int', name: 'account_link2' })
  account_ajuste: number

  @Column({ type: 'int', name: 'account_link3' })
  account_merca: number

  // @Column({ type: 'smallint' })
  is_cash: 0 | 1

  @Column({ type: 'smallint' })
  status: CostCenterStatus

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

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_caja' })
  account: Account

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_ajuste' })
  account_ajustes: Account

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account_merca' })
  account_mercas: Account
}
