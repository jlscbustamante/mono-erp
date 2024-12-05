import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { EntitiesTimeStamps } from "../transformers/entities-timestamps";

@Entity({ name: "inv_brand" })
export class Brand extends EntitiesTimeStamps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  brand: string;

  @Column({ type: "varchar", length: 5 })
  code: string;

  @Column({ type: "smallint" })
  status: number;
}
