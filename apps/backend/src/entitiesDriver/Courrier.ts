import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { CourrierStore } from './Courrier_Store'

@Entity({ name: 'courrier' })
export class Courrier {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'varchar', length: 150 })
  name: string

  @Column({ type: 'varchar', length: 250 })
  email: string

  @Column({ type: 'varchar', length: 25 })
  phone: string

  @Column({ type: 'text' })
  password: string

  @Column({ type: 'text' })
  token: string

  @Column({ type: 'varchar', length: 250 })
  photo: string

  @Column({ type: 'tinyint' })
  check_phone: boolean

  @Column({ type: 'varchar', length: 5 })
  doc_type: string

  @Column({ type: 'varchar', length: 20 })
  doc_number: string

  @Column({ type: 'varchar', length: 1 })
  vehicle: string

  @Column({ type: 'varchar', length: 10 })
  plate: string

  @Column({ type: 'varchar', length: 20 })
  payment_accepted: string

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  rate_min: number

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  rate_var: number

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  distance_min: number

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  ranking: number

  @Column({ type: 'varchar', length: 20 })
  shift_hired: string

  @Column({ type: 'tinyint' })
  status: boolean

  @Column({ type: 'datetime' })
  created_at: Date

  @Column({ type: 'timestamp' })
  updated_at: Date

  @Column({ type: 'int' })
  old_cia_id: number

  @Column({ type: 'tinyint' })
  old_is_external: boolean

  @Column({ type: 'tinyint' })
  old_is_eventual: boolean

  @Column({ type: 'datetime' })
  old_start_contract: Date

  @Column({ type: 'datetime' })
  old_last_contract: Date

  @Column({ type: 'varchar', length: 20 })
  old_shift_worked: string

  @Column({ type: 'varchar', length: 50 })
  old_custom_group: string

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  old_pay_base: number

  @Column({ type: 'int' })
  old_fix_frequency: number

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  old_pay_commission: number

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  old_pay_express: number

  @OneToMany(
    () => CourrierStore,
    (courrierStore: { courrier: any }) => courrierStore.courrier,
  )
  courrierStores: CourrierStore[]
}
