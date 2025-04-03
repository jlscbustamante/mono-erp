import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DateTransformer } from "../transformers/dateTransformer";
import { DecimalTransformer } from "../transformers/decimalTransformer";
import { EntitiesTimeStamps } from "../transformers/entities-timestamps";
import { InvDispatchItem } from "./dispatch-item.entity";

export enum InvDispatchStatus {
  NEW = 1,
  APPROVED = 2,
  DISPATCHED = 3,
  INVOICED = 4,
  CANCELED = 0,
}

@Entity({ name: "adm_sucursal" })
export class SucursalAsWarehouse {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ name: "title", type: "varchar" })
  name: string;

  @Column({ name: "id", type: "varchar" })
  sucursalId: string;

  @Column({ name: "type_sede", type: "char" })
  type: string;

  @Column({ type: "smallint" })
  status: number;

  @Column({ type: "char", length: 1 })
  ubi_route: string;
}

export enum DispatchType {
  BetweenStores = "M",
  WarehouseToStore = "D",
  Exceptional = "E",
}

@Entity({ name: "inv_dispatch" })
export class InvDispatch extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 10, name: "sucursal_from_id" })
  wareFromId: string;

  @Column({ type: "varchar", length: 10, name: "sucursal_to_id" })
  wareToId: string;

  @Column({ type: "varchar", length: 15, name: "num_invoice" })
  numInvoice: string | null;

  @Column({ type: "varchar", length: 15, name: "num_guide" })
  numGuide: string | null;

  @Column({
    name: "move_type",
    enum: DispatchType,
    type: "char",
    length: 1,
  })
  moveType: DispatchType;

  @Column({ type: "varchar", length: 150 })
  gloss: string;

  @Column({
    type: "datetime",
    transformer: new DateTransformer(),
    name: "move_at",
  })
  moveAt: string;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: "net_value",
  })
  netValue: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: "tax_value",
  })
  taxValue: number;

  @Column({
    type: "decimal",
    precision: 16,
    scale: 2,
    transformer: new DecimalTransformer(),
    name: "total_value",
  })
  totalValue: number;

  @Column({ type: "varchar", length: 250, name: "doc_url" })
  docUrl?: string | null;

  @Column({ type: "int" })
  status: InvDispatchStatus;
  // '1: Nuevo; 2: Pendiente; 3: En proceso (comprando a tiendas); 4: En distribución; 5: Finalizado; 9: Extornado',

  @Column({ type: "varchar", length: 150, name: "created_by" })
  createdBy: string;

  @Column({ type: "varchar", length: 150, name: "approved_by" })
  approvedBy: string;

  // transporte
  @Column({ type: "varchar", length: 20 })
  transporte_nro_doc?: string;

  @Column({ type: "varchar", length: 20 })
  transporte_tipo_doc?: string;

  @Column({ type: "varchar", length: 200 })
  transporte_razon_social?: string;

  @Column({ type: "varchar", length: 20 })
  transporte_nro_placa?: string;

  @Column({ type: "varchar", length: 20 })
  conductor_tipo?: string;

  @Column({ type: "varchar", length: 20 })
  conductor_tipo_doc?: string;

  @Column({ type: "varchar", length: 20 })
  conductor_nro_doc?: string;

  @Column({ type: "varchar", length: 200 })
  conductor_nombres?: string;

  @Column({ type: "varchar", length: 200 })
  conductor_apellidos?: string;

  @Column({ type: "varchar", length: 20 })
  conductor_nro_licencia?: string;

  @OneToMany(() => InvDispatchItem, (item) => item.dispatch)
  items?: InvDispatchItem[];

  @ManyToOne(() => SucursalAsWarehouse)
  @JoinColumn({ name: "sucursal_from_id" })
  wareFrom?: SucursalAsWarehouse;

  // @ManyToOne(() => InvWarehouse)
  // @JoinColumn({ name: 'ware_from_id' })
  // wareFrom?: InvWarehouse

  @ManyToOne(() => SucursalAsWarehouse)
  @JoinColumn({ name: "sucursal_to_id" })
  wareTo?: SucursalAsWarehouse;

  // @ManyToOne(() => InvWarehouse)
  // @JoinColumn({ name: 'ware_to_id' })
  // wareTo?: InvWarehouse
}
