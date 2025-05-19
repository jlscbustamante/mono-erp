import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DateTransformer } from "../transformers/dateTransformer";
import { IamRole } from "./iam-role.entity";

@Entity({ name: "iam_user" })
export class IamUser {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 250 })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ type: "int", name: "role_id" })
  rol_id: number;

  @Column({ type: "text" })
  email_token: string;

  @Column({ type: "char", length: 1 })
  email_validate: string;

  @Column({ type: "smallint" })
  status: number;

  @ManyToOne(() => IamRole, (role) => role.id, { eager: true })
  @JoinColumn({ name: "role_id" })
  role: IamRole;

  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    transformer: new DateTransformer(),
  })
  created_at: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
    transformer: new DateTransformer(),
  })
  updated_at: string;
}
