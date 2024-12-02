import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IamFunction } from "./iam-function.entity";

@Entity({ name: "iam_permission" })
export class IamPermission {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "int" })
  rol_id: number;

  @Column({ type: "int" })
  module_id: number;

  @Column({ type: "int" })
  function_id: number;

  @Column({ type: "smallint", width: 6 })
  granted: number;

  @ManyToOne(() => IamFunction, (funk) => funk.id)
  @JoinColumn({ name: "function_id" })
  function: IamFunction;
}
