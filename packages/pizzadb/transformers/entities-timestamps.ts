import { format } from "date-fns";
import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { DateTransformer } from "./dateTransformer";

export class EntitiesTimeStamps {
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "created_at",
    transformer: new DateTransformer(),
  })
  createdAt: string;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "updated_at",
    transformer: new DateTransformer(),
  })
  updatedAt: string;

  @BeforeUpdate()
  updateTimeStamps?(): void {
    this.updatedAt = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  }
}
