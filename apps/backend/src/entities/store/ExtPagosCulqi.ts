import { Column, Entity, PrimaryColumn } from 'typeorm'

import { DateTransformer } from '../../config/transformers/dateTransformer'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'

@Entity({ name: 'ext_pagos_culqi' })
export class ExtPagosCulqi {
  @PrimaryColumn({ type: 'varchar', length: 50, nullable: false })
  transactionkey: string

  @Column({ type: 'varchar', length: 50 })
  aplicacion: string

  @Column({ type: 'varchar', length: 50 })
  idventa: string

  @Column({ type: 'varchar', length: 50 })
  idcliente: string

  @Column({ type: 'varchar', length: 50 })
  idcargo: string

  @Column({ type: 'varchar', length: 50 })
  nombrescliente: string

  @Column({ type: 'varchar', length: 50 })
  apellidoscliente: string

  @Column({ type: 'varchar', length: 50 })
  correoelectronicocliente: string

  @Column({ type: 'varchar', length: 50 })
  marca: string

  @Column({ type: 'varchar', length: 50 })
  nrotarjeta: string

  @Column({ type: 'varchar', length: 50 })
  ult4digitos: string

  @Column({ type: 'varchar', length: 50 })
  moneda: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadelatransaccion: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadeabono: string

  @Column({ type: 'varchar', length: 50 })
  codigorespuesta: string

  @Column({ type: 'varchar', length: 50 })
  descripcionproducto: string

  @Column({ type: 'varchar', length: 50 })
  nombrestarjeta: string

  @Column({ type: 'varchar', length: 50 })
  apellidostarjeta: string

  @Column({ type: 'varchar', length: 50 })
  correoelectronicotarjeta: string

  @Column({ type: 'varchar', length: 100 })
  pais: string

  @Column({ type: 'varchar', length: 100 })
  ciudad: string

  @Column({ type: 'varchar', length: 100 })
  direccion: string

  @Column({ type: 'varchar', length: 100 })
  telefono: string

  @Column({ type: 'varchar', length: 100 })
  nombredebanco: string

  @Column({ type: 'varchar', length: 50 })
  paisbanco: string

  @Column({ type: 'varchar', length: 50 })
  producto: string

  @Column({ type: 'varchar', length: 50 })
  codigoreferencia: string

  @Column({ type: 'varchar', length: 50 })
  ticket: string

  @Column({ type: 'varchar', length: 50 })
  codigoautorizacion: string

  @Column({ type: 'varchar', length: 50 })
  terminal: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  fechadevolucion: string

  @Column({ type: 'int' })
  devolucion: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montoventa: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionvariableventa: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  igvventa: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionventa: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montoaproximadoabonoventa: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montopropina: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionvariablepropina: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  igvpropina: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionpropina: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montoaproximadoabonopropina: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  ventafinaltotal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionvariabletotal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisionfijatotal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  igvtotal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  comisiontotal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montoaproximadoabonototal: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  montoabonofinal: number

  @Column({ type: 'varchar', length: 50 })
  idvoucher: string

  @Column({ type: 'varchar', length: 50 })
  serieterminal: string

  @Column({ type: 'varchar', length: 50 })
  estado: string

  @Column({ type: 'varchar', length: 50 })
  tipopago: string

  @Column({ type: 'varchar', length: 10 })
  sucursalcode: string

  @Column({ type: 'varchar', length: 100 })
  sucursalnombre: string

  @Column({ type: 'varchar', length: 50 })
  nropedido: string

  @Column({ type: 'varchar', length: 50, name: 'fechadelatransaccion_iso' })
  fechadelatransaccionIso: string

  @Column({ type: 'varchar', length: 50, name: 'fechadeabono_iso' })
  fechadeabonoIso: string

  @Column({ type: 'varchar', length: 50, name: 'cashmove_id' })
  cashmoveId: string

  @Column({ type: 'varchar', length: 50, name: 'requestpay_id' })
  requestpayId: string

  @Column({ type: 'smallint', name: 'copiedto_dw', nullable: false })
  copiedtoDw: string
}
