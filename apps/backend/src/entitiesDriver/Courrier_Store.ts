import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Courrier } from './Courrier'
import { StoreCourrier } from './Store_Courrier'

@Entity({ name: 'courrier_store' })
export class CourrierStore {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number
  @Column({ type: 'int' })
  courrier_id: number

  @Column({ type: 'int' })
  cia_id: number

  @Column({ type: 'int' })
  store_id: number

  @Column({ type: 'datetime' })
  created_at: Date

  @Column({ type: 'datetime' })
  updated_at: Date

  @Column({ type: 'int' })
  old_store_id: number
  @ManyToOne(() => Courrier, (courrier) => courrier.courrierStores)
  @JoinColumn({ name: 'courrier_id' })
  courrier: Courrier

  @ManyToOne(() => StoreCourrier, (store) => store.courrierStores)
  @JoinColumn({ name: 'store_id' })
  store: StoreCourrier
}
