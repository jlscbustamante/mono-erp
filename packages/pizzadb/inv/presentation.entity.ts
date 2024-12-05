import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { EntitiesTimeStamps } from "../transformers/entities-timestamps";

@Entity({ name: "inv_presentation" })
export class Presentation extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  presentation: string;

  @Column({ type: "smallint" })
  status: number;
}
