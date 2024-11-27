import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { EntitiesTimeStamps } from '../../config/EntitiesTimestamps'
import { DateTransformer } from '../../config/transformers/dateTransformer'
import { DecimalTransformer } from '../../config/transformers/decimalTransformer'

@Entity({ name: 'sls_sucursal_sales' })
export class SucursalSale extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 10 })
  store_id: string

  @Column({ type: 'datetime', transformer: new DateTransformer() })
  sales_at: string

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    precision: 8,
    scale: 2,
  })
  sales_cash: number

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    precision: 8,
    scale: 2,
  })
  sales_pm: number

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    precision: 8,
    scale: 2,
  })
  sales_others: number

  @Column({
    type: 'decimal',
    transformer: new DecimalTransformer(),
    precision: 8,
    scale: 2,
  })
  sales_total: number

  @Column({
    type: 'varchar',
    length: 150,
  })
  created_by: string
}
