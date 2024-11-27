import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'sys_menu_report' })
export class MenuReport {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number | null

  @Column({ type: 'varchar' })
  rpt_name: string

  @Column({ type: 'varchar' })
  key_report: string

  @Column({ type: 'varchar' })
  key_workspc: string

  @Column({ type: 'varchar' })
  rpt_url: string

  @Column({ type: 'varchar' })
  rpt_token: string

  @Column({ type: 'int' })
  priority: number

  @Column({ type: 'int' })
  show_in: number

  @Column({ type: 'int' })
  status: 1 | 0

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
