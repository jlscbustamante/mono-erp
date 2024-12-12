import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DateTransformer2 } from "../transformers/dateTransformer";
import { Attendance } from "./attendance.entity";

@Entity({ name: "rh_employee" })
export class RhEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 150 })
  first_name: string;

  @Column("varchar", { length: 150 })
  last_name: string;

  @Column("varchar", { length: 45 })
  doc_type: string;

  @Column("varchar", { length: 45 })
  doc_number: string;

  @Column("varchar", { length: 25 })
  phone: string;

  @Column("varchar", { length: 250 })
  email: string;

  @Column("datetime", { transformer: new DateTransformer2() })
  birthday_at: string;

  @Column("varchar", { length: 1 })
  gender: string;

  @Column("varchar", { length: 25 })
  job_title: string;

  @Column("varchar", { length: 25 })
  job_mode: string;

  @Column("varchar", { length: 250 })
  pic_photo: string;

  @Column("varchar", { length: 250 })
  pic_docf: string;

  @Column("varchar", { length: 250 })
  pic_docb: string;

  @Column("varchar", { length: 10 })
  sucursal_id: string;

  @Column("smallint")
  status: number;

  @OneToMany(() => Attendance, (assistance) => assistance.employee)
  assistance: Attendance[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  private setCreatedAt() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  @BeforeUpdate()
  private setUpdateAt() {
    this.updated_at = new Date();
  }
}
