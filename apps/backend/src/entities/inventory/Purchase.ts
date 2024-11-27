import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DateTransformer } from '../../config/transformers/dateTransformer'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { InvPurchaseItem } from './PurchaseItem'

@Entity({ name: 'inv_purchase' })
export class InvPurchase extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'supplier_id', type: 'int' })
  supplierId: number

  @Column({ name: 'supplier_name', type: 'varchar', length: 150 })
  supplierName: string

  @Column({ name: 'company_sap', type: 'varchar', length: 150 })
  companySap: string | null

  @Column({ name: 'num_invoice', type: 'varchar', length: 15 })
  numInvoice: string | null

  @Column({ name: 'num_guide', type: 'varchar', length: 15 })
  numGuide: string | null

  @Column({ type: 'varchar', length: 150 })
  gloss: string

  @Column({
    type: 'datetime',
    name: 'purchase_at',
    transformer: new DateTransformer(),
  })
  purchaseAt: string

  @Column({
    name: 'net_value',
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  netValue: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  discount: number

  @Column({
    name: 'tax_value',
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  taxValue: number

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  totalValue: number

  @Column({ name: 'movepay_id', type: 'int' })
  movepayId: number | null

  @Column({ type: 'smallint' })
  status: 1 | 2 | 3 | 4 | 5 | 9

  @Column({ name: 'warehouse_id', type: 'varchar', length: 10 })
  warehouseId?: string

  @Column({ name: 'created_by', type: 'varchar', length: 150 })
  createdBy: string

  @OneToMany(() => InvPurchaseItem, (item) => item.purchase)
  items?: InvPurchaseItem[]
}
