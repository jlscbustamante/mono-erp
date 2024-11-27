import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { CourrierStore } from './Courrier_Store'

@Entity({ name: 'store' })
export class StoreCourrier {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string

  @Column({ type: 'varchar', length: 150 })
  title: string

  @Column({ type: 'int' })
  cia_id: number

  @Column({ type: 'varchar', length: 25 })
  phone: string

  @Column({ type: 'varchar', length: 50 })
  external_code: string

  @Column({ type: 'varchar', length: 250 })
  street_name: string

  @Column({ type: 'varchar', length: 25 })
  street_number: string

  @Column({ type: 'varchar', length: 250 })
  reference: string

  @Column({ type: 'varchar', length: 50 })
  district: string

  @Column({ type: 'varchar', length: 50 })
  city: string

  @Column({ type: 'varchar', length: 50 })
  country: string

  @Column({ type: 'varchar', length: 10 })
  ubigeo: string

  @Column({ type: 'varchar', length: 10 })
  zipcode: string

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  latitude: number

  @Column({ type: 'decimal', precision: 13, scale: 10 })
  longitude: number

  @Column({ type: 'tinyint' })
  status: boolean

  @Column({ type: 'datetime' })
  created_at: Date

  @Column({ type: 'timestamp' })
  updated_at: Date

  @OneToMany(() => CourrierStore, (courrierStore) => courrierStore.store)
  courrierStores: CourrierStore[]
}
