import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { CashAccountTypeStatus } from '../types/cashAccount'

@Entity({ name: 'adm_type_cash' })
export class CashAccountType {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'char' })
  type_id: string

  @Column({ type: 'enum', enum: CashAccountTypeStatus })
  status: CashAccountTypeStatus
}
