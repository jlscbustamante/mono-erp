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
import { Supplier } from '../Supplier'
import { Measure } from './Measure'
import { ProductCategory } from './ProductCategory'
import { InvSupplier } from './Supplier'

@Entity({ name: 'inv_product' })
export class Product extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  product: string

  @Column({ type: 'int', name: 'category_id' })
  categoryId: number

  @Column({ type: 'varchar', length: 15, name: 'external_code' })
  externalCode: string

  @Column({ type: 'int', name: 'measure_id' })
  measureId: number

  @Column({ type: 'int', name: 'formula_id' })
  formulaId: number | null

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    name: 'unit_price',
    transformer: new DecimalTransformer(),
  })
  unitPrice: number

  @Column({ type: 'tinyint' })
  status: StatusEntityNumber

  @ManyToOne(() => Measure)
  @JoinColumn({ name: 'measure_id' })
  measure?: Measure

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category?: ProductCategory
}
