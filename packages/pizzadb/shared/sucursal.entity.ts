import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { DateTransformer } from "../transformers/dateTransformer";

@Entity({ name: "adm_sucursal" })
export class Sucursal {
  @PrimaryColumn({ type: "varchar" })
  id: string;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar", length: 10, name: "company_id" })
  trademark_id: string;

  @Column({ type: "varchar" })
  ubi_address: string;

  @Column({ type: "varchar", length: 10, name: "cfd_serie_fa" })
  cfd_serie: string;

  @Column({ type: "int", name: "cfd_seql_fa" })
  cfd_correlativo: number;

  @Column({ type: "varchar", length: 10, name: "cfd_serie_gr" })
  guide_serie: string;

  @Column({ type: "int", name: "cfd_seql_gr" })
  guide_correlativo: number;

  @Column({ type: "varchar", length: 10 })
  cfd_serie_bo: string;

  @Column({ type: "varchar", length: 10 })
  cfd_seql_bo: number;

  @Column({ type: "varchar" })
  ubi_district: string;

  @Column({ type: "varchar" })
  ubi_city: string;

  @Column({ type: "char", length: 1 })
  ubi_route: string;

  @Column({ type: "varchar", length: 100 })
  efact_pass: string;

  @Column({ type: "char" })
  type_sede: string;

  @Column({ type: "varchar", name: "sede_razon_social" })
  legalperson_name: string;

  @Column({ type: "char" })
  legalperson_docnum: string;

  @Column({ type: "varchar" })
  legalperson_doctype: string;

  @Column({ type: "varchar" })
  legalperson_account_bco: string;

  @Column({ type: "varchar" })
  legalperson_account_num: string;

  @Column({ type: "varchar" })
  legalperson_account_cci: string;

  @Column({ type: "varchar", length: 15 })
  sede_nro_ruc: string;

  @Column({ type: "varchar" })
  legalperson_account_cur: string;

  @Column({ type: "varchar" })
  legalperson_account_type: string;

  @Column({ type: "smallint" })
  status: number;

  @Column({
    type: "decimal",
    precision: 4,
    scale: 2,
  })
  cfd_igv: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    transformer: new DateTransformer(),
  })
  created_at: string;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    transformer: new DateTransformer(),
  })
  updated_at: string;
}
