import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DecimalTransformer } from "../transformers/decimalTransformer";
import { EntitiesTimeStamps } from "../transformers/entities-timestamps";
import { InvDispatch } from "./dispatch.entity";
import { Item } from "./item.entity";
import { Presentation } from "./presentation.entity";

@Entity({ name: "inv_dispatch_item" })
export class InvDispatchItem extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "dispatch_id", type: "int" })
  dispatchId: number;

  @Column({ name: "item_id", type: "int" })
  itemId: number;

  @Column({ name: "item_name", type: "varchar", length: 150 })
  itemName: string;

  @Column({ name: "presentation_id", type: "int" })
  presentationId: number;

  @Column({ name: "presentation_name", type: "varchar", length: 50 })
  presentationName: string;

  @Column({ name: "measure_id", type: "int" })
  measureId: number;

  @Column({
    name: "weight",
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  weight: number;

  @Column({
    name: "unit_value",
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  unitValue: number;

  @Column({
    name: "quantity",
    type: "decimal",
    precision: 16,
    scale: 3,
    transformer: new DecimalTransformer(),
  })
  quantity: number;

  @Column({
    name: "total_value",
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  totalValue: number;

  @ManyToOne(() => InvDispatch, (dispatch) => dispatch.items)
  @JoinColumn({ name: "dispatch_id" })
  dispatch: InvDispatch;

  @OneToOne(() => Item, (item) => item.id)
  @JoinColumn({ name: "item_id" })
  item?: Item;

  @OneToOne(() => Presentation, (item) => item.id)
  @JoinColumn({ name: "presentation_id" })
  presentation?: Presentation;
}
