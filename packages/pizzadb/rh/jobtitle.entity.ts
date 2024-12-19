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
import { RhEmployee } from "./employee.entity";

@Entity({ name: "rh_jobtitle" })
export class JobTitle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100 })
  name: string;

  @Column("varchar", { length: 100 })
  description: string;

  @OneToMany(() => RhEmployee, (employee) => employee.jobtitle)
  employees: RhEmployee[];

  @Column("smallint")
  status: number;

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
