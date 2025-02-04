import dayjs from "dayjs";
import {
  char,
  datetime,
  int,
  mysqlTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const costCenters = mysqlTable("fin_costcenter", {
  id: int().autoincrement().notNull().primaryKey(),
  costcenter: varchar({ length: 150 }).notNull(),
  company_id: varchar({ length: 10 }).notNull(),
  sucursal_id: varchar({ length: 10 }).notNull(),
  /**
   * @description T: Tienda; A: Area oficina
   */
  type_cc: char({ length: 1 }).default("T"),
  account_link1: varchar({ length: 15 }),
  account_link2: varchar({ length: 15 }),
  account_link3: varchar({ length: 15 }),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const cashBanks = mysqlTable("fin_cashbank", {
  id: int().autoincrement().notNull().primaryKey(),
  cashbank: varchar({ length: 150 }).notNull(),
  /**
   * @description 1:Tiendas; 3:Bancos; 4:Central; 5:Corales; 6:Liquidadora
   */
  type_cash: smallint().notNull(),
  account_id: varchar({ length: 15 }),
  company_id: varchar({ length: 10 }).notNull(),
  sucursal_id: varchar({ length: 10 }),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});
