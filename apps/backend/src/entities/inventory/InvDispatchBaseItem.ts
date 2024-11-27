import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DecimalTransformer } from '../../config/transformers/decimalTransformer'
import { Item } from './Item'
import { Measure } from './Measure'

@Entity({ name: 'inv_dispatchbase_item' })
export class InvDispatchBaseItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int', nullable: false })
  dispatch_id: number

  @Column({ type: 'int' })
  item_move_id: number

  @Column({ type: 'varchar', length: 150 })
  item_move_name: string

  @Column({ type: 'int' })
  item_stock_id: number

  @Column({ type: 'int' })
  presentation_id: number

  @Column({ type: 'varchar', length: 50 })
  presentation_name: string

  @Column({ type: 'int' })
  measure_id: number

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    name: 'unit_value',
  })
  unitValue: number

  @Column({
    type: 'decimal',
    precision: 16,
    scale: 2,
    default: 0.0,
    transformer: new DecimalTransformer(),
  })
  quantity: number

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_stock_id' })
  itemStock: Item

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'item_move_id' })
  itemMove: Item

  @ManyToOne(() => Measure)
  @JoinColumn({ name: 'measure_id' })
  measure: Measure
}
