import type { InferSelectModel } from "drizzle-orm";
import { char, mysqlTable, varchar } from "drizzle-orm/mysql-core";

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
  trademark_id: varchar({ length: 10 }).notNull(),
});

export type SucursalSelect = InferSelectModel<typeof sucursalTable>;
