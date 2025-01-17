import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Sucursal } from "../shared";
import { RhEmployee } from "./employee.entity";

export enum ATTENDANCE_EVENT {
  IN = "ENTRADA",
  OUT = "SALIDA",
  REFRIGERATOR_SALE = "REFRI_SALE",
  REFRIGERATOR_RETURN = "REFRI_RETORNO",
}

@Entity({ name: "rh_assistance" })
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  employee_id: number;

  @Column("datetime")
  attendance_at: string;

  @Column("varchar", { length: 20 })
  event: ATTENDANCE_EVENT;

  @Column("varchar", { length: 250 })
  pic_photo: string | null;

  @Column("varchar", { length: 10 })
  sucursal_id: string;

  @Column("smallint")
  status: number;

  @ManyToOne(() => RhEmployee, (employee) => employee.assistance)
  @JoinColumn({ name: "employee_id" })
  employee: RhEmployee;

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: "sucursal_id" })
  sucursal: Sucursal;

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
