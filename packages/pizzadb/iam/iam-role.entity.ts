import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { DateTransformer } from "../transformers/dateTransformer";
import { IamUser } from "./iam-user.entity";

@Entity({ name: "iam_role" })
export class IamRole {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", name: "role" })
  name: string;

  @Column({ type: "smallint" })
  status: number;

  @OneToMany(() => IamUser, (user) => user.role)
  user: IamUser[];

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    transformer: new DateTransformer(),
  })
  created_at: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    transformer: new DateTransformer(),
  })
  updated_at: string;
}
