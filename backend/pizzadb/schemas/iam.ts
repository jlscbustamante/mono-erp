import dayjs from "dayjs";
import {
  datetime,
  int,
  mysqlTable,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";

export const roles = mysqlTable("iam_role", {
  id: int().autoincrement().notNull().primaryKey(),
  role: varchar({ length: 100 }).notNull(),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const users = mysqlTable("iam_user", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 150 }).notNull(),
  email: varchar({ length: 250 }).notNull(),
  phone: varchar({ length: 20 }),
  password: text().notNull(),
  role_id: int().notNull(),
  email_token: text(),
  email_validate: varchar({ length: 1 }).notNull().default("N"),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
}));
