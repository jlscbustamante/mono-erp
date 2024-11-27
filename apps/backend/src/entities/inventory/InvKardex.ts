import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DecimalTransformer } from '../../config/transformers/decimalTransformer'

@Entity({ name: 'inv_kardex' })
export class InvKardex {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int', { name: 'item_id' })
  itemId: number

  @Column('varchar', { name: 'item_name', length: 150 })
  itemName: string

  @Column('int', { name: 'presentation_id' })
  presentationId: number

  @Column('varchar', { name: 'presentation_name', length: 150 })
  presentationName: string

  @Column('char', { length: 1, name: 'move_type' })
  moveType: string

  @Column('int', { name: 'move_id' })
  moveId: number

  @Column('char', { length: 1, name: 'move_flow' })
  moveFlow: string

  @Column('char', { length: 1, name: 'type_doc', nullable: true })
  typeDoc: string | null

  @Column('varchar', { length: 15, name: 'num_doc', nullable: true })
  numDoc: string | null

  @Column('varchar', { length: 10, name: 'warehouse_id' })
  warehouseId: string

  @Column('datetime', { name: 'move_at' })
  moveAt: Date

  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  quantity: number

  /**
   * @description Precio de compra
   */
  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'unit_purchase',
  })
  unitPurchase: number

  /**
   * @description Precio de venta
   */
  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'unit_price',
  })
  unitPrice: number

  /**
   * @description Total precio venta
   */
  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'total_price',
  })
  totalPrice: number

  /**
   * @description Ultimo stock
   */
  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'stock_last',
  })
  stockLast: number

  /**
   * @description stock actual
   */
  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'stock_current',
  })
  stockCurrent: number

  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'total_last',
  })
  totalLast: number

  @Column('decimal', {
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: 'total_current',
  })
  totalCurrent: number

  @Column('datetime', { name: 'created_at' })
  createdAt: Date

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date()
  }
}
