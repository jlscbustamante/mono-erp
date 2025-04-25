import dayjs from "dayjs";
import type { InferSelectModel } from "drizzle-orm";
import {
  char,
  datetime,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const sucursalTable = mysqlTable("adm_sucursal", {
  id: varchar({ length: 10 }).notNull().primaryKey(),
  title: varchar({ length: 150 }).notNull(),
  /**
   * @description T: Tienda, A: Almacén, O: Sucursal
   */
  type_sede: char({ length: 1 }).notNull(),
  /**
   * @description [PIZZARAUL,PIZZAM]
   */
  trademark_id: varchar("company_id", { length: 10 }).notNull(),
  guide_template: varchar({ length: 15 }),
});

export const trademarkTable = mysqlTable("adm_trademark", {
  id: varchar({ length: 10 }).notNull().primaryKey(),
  title: varchar({ length: 150 }).notNull(),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export type SucursalSelect = InferSelectModel<typeof sucursalTable>;
export type TrademarkSelect = InferSelectModel<typeof trademarkTable>;
