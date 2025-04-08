// pizzadb/schema/catalog.ts
import {
    mysqlTable,
    int,
    varchar,
    smallint,
    datetime,
    timestamp,
  } from "drizzle-orm/mysql-core"
  import dayjs from "dayjs";
  import { decimalNumber } from "@pizzadb/drizzle-extend.ts";
  
  export const inv_product = mysqlTable("inv_products", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    product: varchar("product", { length: 150 }).notNull(),
    menuprod_id: int("menuprod_id").notNull(),
    status: smallint("status").notNull(),
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
        dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
        .notNull()
        .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  })
  
  export const inv_product_flavor = mysqlTable("inv_product_flavor", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    flavor: varchar("flavor", { length: 150 }).notNull(),
    menuflav_id: int("menuflav_id").notNull(),
    status: smallint("status").notNull(),
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
        dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
        .notNull()
        .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  })
  
  export const inv_product_size = mysqlTable("inv_product_size", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    size: varchar("size", { length: 150 }).notNull(),
    is_ref: smallint("is_ref").default(0), 
    factor: decimalNumber("factor", { precision: 8, scale: 2 }),
    menusize_id: int("menusize_id").notNull(),
    status: smallint("status").notNull().default(1),
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
        dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
        .notNull()
        .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  });