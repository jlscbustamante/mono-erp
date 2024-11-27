import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { StatusEntityNumber } from '../../types'
import { ItemRelationship, ItemType } from '../../types/inventory/item'
import { Brand } from './Brand'
import { Measure } from './Measure'
import { Presentation } from './Presentation'
import { Product } from './Product'
import { InvSupplier } from './Supplier'

@Entity({ name: 'inv_item' })
export class Item extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150, name: 'item_name' })
  itemName: string

  @Column({ type: 'int', name: 'product_id' })
  productId: number

  @Column({ type: 'int', name: 'brand_id' })
  brandId: number

  @Column({ type: 'int', name: 'presentation_id' })
  presentationId: number

  @Column({ type: 'int', name: 'supplier_id' })
  supplierId: number

  @Column({ type: 'int', name: 'measure_id' })
  measureId: number

  @Column({ type: 'char', name: 'item_used_to' })
  itemType: ItemType

  @Column({ type: 'char', name: 'item_type' })
  relationShip: ItemRelationship

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'unit_price',
    transformer: new DecimalTransformer(),
  })
  unitPrice: number

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'unit_cost',
    transformer: new DecimalTransformer(),
  })
  /** Representa el precio de transporte */
  unitCost: number

  @Column({ type: 'tinyint' })
  status: StatusEntityNumber

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand

  @ManyToOne(() => Presentation)
  @JoinColumn({ name: 'presentation_id' })
  presentation: Presentation

  @ManyToOne(() => InvSupplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier?: InvSupplier

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product?: Product

  @ManyToOne(() => Measure)
  @JoinColumn({ name: 'measure_id' })
  measure?: Measure
}
