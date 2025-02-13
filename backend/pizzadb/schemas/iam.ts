import type { InferSelectModel } from "drizzle-orm";
import {
  int,
  mysqlTable,
  smallint,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("iam_user", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
  email: varchar({ length: 250 }).notNull(),
  phone: varchar({ length: 20 }),
  password: text().notNull(),
  status: smallint().notNull(),
});

export const roles = mysqlTable("iam_role", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  status: smallint().notNull(),
});

export const permissions = mysqlTable("iam_permission", {
  id: int().autoincrement().notNull().primaryKey(),
  rol_id: int().notNull(),
  module_id: int().notNull(),
  function_id: int().notNull(),
});

export const functions = mysqlTable("iam_function", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
  module_id: int().notNull(),
  path_function: varchar({ length: 250 }).notNull(),
  path_view: varchar({ length: 250 }).notNull(),
  priority: smallint(),
  status: smallint().notNull(),
});

export type FunctionSelect = InferSelectModel<typeof functions>;
