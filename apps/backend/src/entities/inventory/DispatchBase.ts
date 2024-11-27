export interface DispatchBase {
  // @Column({
  //   type: 'varchar',
  //   length: 10,
  //   nullable: false,
  //   comment: 'PR-AAAAMMDD',
  // })
  id: string

  // @Column({ type: 'int', nullable: false, name: 'product_id' })
  product_id: number

  // @Column({ type: 'int', nullable: false, name: 'item_id' })
  item_id: number

  // @Column({ type: 'varchar', length: 150, nullable: false, name: 'item_name' })
  item_name: string

  // @Column({ type: 'int', nullable: true, name: 'measure_id' })
  measure_id: number

  // @Column({ type: 'int', nullable: true, name: 'presentation_id' })
  presentation_id: number

  // @Column({
  //   type: 'decimal',
  //   precision: 16,
  //   scale: 2,
  //   default: 0.0,
  //   name: 'unit_value',
  //   transformer: new DecimalTransformer(),
  // })
  unit_value: number

  // @Column({
  //   type: 'decimal',
  //   precision: 16,
  //   scale: 2,
  //   default: 0.0,
  //   name: 'quantity',
  //   transformer: new DecimalTransformer(),
  // })
  quantity: number

  // @Column({
  //   type: 'decimal',
  //   precision: 16,
  //   scale: 2,
  //   default: 0.0,
  //   name: 'total_value',
  //   transformer: new DecimalTransformer(),
  // })
  total_value: number
}
