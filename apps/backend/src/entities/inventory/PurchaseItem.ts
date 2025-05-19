import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Item } from 'pizzadb'
import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { InvPurchase } from './Purchase'

@Entity({ name: 'inv_purchase_item' })
export class InvPurchaseItem extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'purchase_id', type: 'int' })
  purchaseId: number

  @Column({
    name: 'item_id',
    type: 'int',
  })
  itemId: number

  @Column({ name: 'item_name', type: 'varchar' })
  itemName: string

  presentationId: number

  presentationName: string

  @Column({
    name: 'unit_value',
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  unitValue: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  quantity: number

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  totalValue: number

  @ManyToOne(() => InvPurchase, (purchase) => purchase.items)
  @JoinColumn({ name: 'purchase_id' })
  purchase: InvPurchase

  @OneToOne(() => Item, (item) => item.id)
  @JoinColumn({ name: 'item_id' })
  item: Item
}
