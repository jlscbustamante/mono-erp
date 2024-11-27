import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Sucursal } from 'pizzadb'
import { DateTransformer } from '../config/transformers/dateTransformer'

@Entity({ name: 'adm_terminalpos' })
export class TerminalPost {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar' })
  terminal: string

  @Column({ type: 'varchar' })
  sucursal_id: string

  @Column({ type: 'varchar' })
  supplier: string

  @Column({ type: 'int' })
  status: number

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

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'sucursal_id' })
  sucursal: Sucursal
}
