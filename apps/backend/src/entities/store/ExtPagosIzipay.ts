import { Column, Entity, PrimaryColumn } from 'typeorm'

import { DateTransformer } from '../../config/transformers/dateTransformer'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'

@Entity({ name: 'ext_pagos_izipay' })
export class ExtPagosIzipay {
  @PrimaryColumn({ type: 'varchar', length: 50, nullable: false })
  transactionkey: string

  @Column({ type: 'varchar', length: 50 })
  transaccion: string

  @Column({ type: 'varchar', length: 50 })
  tipodemovimiento: string

  @Column({ type: 'varchar', length: 50 })
  tipodecaptura: string

  @Column({ type: 'varchar', length: 50 })
  terminal: string

  @Column({ type: 'varchar', length: 100 })
  sucursalnombre: string

  @Column({ type: 'varchar', length: 10 })
  sucursalcode: string

  @Column({ type: 'varchar', length: 50 })
  serieterminal: string

  @Column({ type: 'varchar', length: 50, name: 'requestpay_id' })
  requestpayId: string

  @Column({ type: 'varchar', length: 50 })
  observaciones: string

  @Column({ type: 'varchar', length: 50 })
  numdetarjeta: string

  @Column({ type: 'int' })
  numderef: number

  @Column({ type: 'int' })
  numdelote: number

  @Column({ type: 'varchar', length: 50 })
  moneda: string

  @Column({ type: 'varchar', length: 50 })
  marcadetarjeta: string

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  importeneto: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  importe: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  igv: number

  @Column({ type: 'varchar', length: 50, name: 'fechadetransaccion_iso' })
  fechadetransaccionIso: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadetransaccion: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadeproceso: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadecierredelote: string

  @Column({ type: 'varchar', length: 50, name: 'fechadeabono_iso' })
  fechadeabonoIso: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadeabono: string

  @Column({ type: 'varchar', length: 50 })
  estado: string

  @Column({ type: 'int' })
  cuotas: number

  @Column({
    type: 'smallint',
    name: 'copiedto_dw',
    nullable: false,
    default: 0,
  })
  copiedtoDw: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comision: number

  @Column({ type: 'varchar', length: 50 })
  codigodeautorizacion: string

  @Column({ type: 'varchar', length: 50 })
  codigo: string

  @Column({ type: 'varchar', length: 50, name: 'cashmove_id' })
  cashmoveId: string
}
