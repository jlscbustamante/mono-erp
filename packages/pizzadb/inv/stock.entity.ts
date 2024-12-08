import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DateTransformer } from "../transformers/dateTransformer";
import { DecimalTransformer } from "../transformers/decimalTransformer";
import { EntitiesTimeStamps } from "../transformers/entities-timestamps";
import { Item } from "./item.entity";

export enum StockStatus {
  CANCELED = 0,
  PENDING = 1,
  CLOSED = 2,
}

@Entity({ name: "inv_stock" })
export class InvStock extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  item_id: number;

  @Column({ type: "varchar", length: 150 })
  item_name: string;

  @Column({ type: "int" })
  presentation_id: number;

  @Column({ type: "varchar", length: 50 })
  presentation_name: string;

  @Column({ type: "int", name: "measure_id" })
  measure_id: number;

  @Column({ type: "varchar", length: 10 })
  warehouse_id: string;

  categoryName?: string;

  @Column({
    type: "datetime",
    transformer: new DateTransformer(),
  })
  stock_at: string;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  stock_last: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  total_last: number;

  /**
   * @deprecated
   */
  // @Column({
  //   type: 'decimal',
  //   precision: 16,
  //   scale: 3,
  //   transformer: new DecimalTransformer(),
  // })
  quantity_in: number;

  /**
   * @deprecated
   */
  // @Column({
  //   type: 'decimal',
  //   precision: 16,
  //   scale: 3,
  //   transformer: new DecimalTransformer(),
  // })
  quantity_out: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_in_dp: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_out_dp: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_in_mv: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_out_mv: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_out_sl: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
    default: 0,
  })
  quantity_in_pu: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  stock_current: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  stock_physical: number;

  @Column({
    type: "decimal",
    precision: 8,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  unit_value: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  total_value: number;

  @Column({ type: "varchar" })
  created_by: string;

  @Column({ type: "smallint", default: StockStatus.PENDING })
  status: StockStatus;

  @ManyToOne(() => Item)
  @JoinColumn({ name: "item_id" })
  item: Item;
}
