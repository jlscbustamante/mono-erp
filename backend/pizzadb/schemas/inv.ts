import dayjs from "dayjs";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import {
  char,
  datetime,
  int,
  mysqlTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { decimalNumber } from "../drizzle-extend.ts";

export const dispatches = mysqlTable("inv_dispatch", {
  id: int().autoincrement().notNull().primaryKey(),
  sucursal_from_id: varchar({ length: 10 }).notNull(),
  sucursal_to_id: varchar({ length: 10 }),
  num_invoice: varchar({ length: 15 }),
  num_guide: varchar({ length: 15 }),
  gloss: varchar({ length: 150 }).notNull(),
  transporte_nro_doc: varchar({ length: 20 }),
  transporte_tipo_doc: varchar({ length: 20 }),
  transporte_razon_social: varchar({ length: 200 }),
  transporte_nro_placa: varchar({ length: 20 }),
  conductor_nombres: varchar({ length: 200 }),
  conductor_apellidos: varchar({ length: 200 }),
  conductor_nro_licencia: varchar({ length: 20 }),
  move_at: datetime({
    mode: "string",
  }).notNull(),
  move_type: char({ length: 1 }).notNull().default("D"),
  net_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  tax_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  total_value: decimalNumber("total_value", {
    precision: 16,
    scale: 2,
  })
    .notNull()
    .default(0),
  requested_by: varchar({ length: 150 }),
  approved_by: varchar({ length: 150 }),
  doc_url: varchar({ length: 250 }),
  status: smallint().notNull().default(1),
  created_by: varchar({ length: 150 }).notNull().default("sys"),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const dispatchesItems = mysqlTable("inv_dispatch_item", {
  id: int().autoincrement().notNull().primaryKey(),
  dispatch_id: int().notNull(),
  item_id: int().notNull(),
  item_name: varchar({ length: 150 }).notNull(),
  presentation_id: int().notNull(),
  presentation_name: varchar({ length: 50 }).notNull(),
  measure_id: int().notNull(),
  weight: decimalNumber({ precision: 16, scale: 3 }).notNull().default(0),
  unit_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  quantity: decimalNumber({ precision: 16, scale: 3 }).notNull().default(0),
  total_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  created_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$defaultFn(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdateFn(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  peso_bruto: decimalNumber({ precision: 16, scale: 2 }),
});

export const dispatchItemRelation = relations(dispatchesItems, ({ one }) => ({
  dispatch: one(dispatches, {
    fields: [dispatchesItems.dispatch_id],
    references: [dispatches.id],
  }),
}));

export const dispatchesRelation = relations(dispatches, ({ many }) => ({
  items: many(dispatchesItems),
}));

export const stocks = mysqlTable("inv_stock", {
  id: int().autoincrement().notNull().primaryKey(),
  item_id: int().notNull(),
  item_name: varchar({ length: 150 }).notNull(),
  presentation_id: int().notNull(),
  presentation_name: varchar({ length: 50 }).notNull(),
  measure_id: int().notNull(),
  warehouse_id: varchar({ length: 10 }).notNull(),
  stock_at: datetime({ mode: "string" }).notNull(),
  total_last: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  stock_last: decimalNumber({ precision: 16, scale: 3 }).notNull().default(0),
  quantity_in_pu: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  quantity_in_dp: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  quantity_in_mv: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  quantity_out_dp: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  quantity_out_mv: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  quantity_out_sl: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  stock_current: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  stock_physical: decimalNumber({ precision: 16, scale: 3 })
    .notNull()
    .default(0),
  unit_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  total_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  status: smallint().notNull().default(1),
  created_by: varchar({ length: 150 }).notNull().default("sys"),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const templates = mysqlTable("inv_dispatchbase", {
  id: int().autoincrement().notNull().primaryKey(),
  sucursal_type: varchar({ length: 15 }).notNull(),
  used_to: char({ length: 1 }).notNull(),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const templatesItems = mysqlTable("inv_dispatchbase_item", {
  id: int().autoincrement().notNull().primaryKey(),
  dispatch_id: int().notNull(),
  item_move_id: int().notNull(),
  item_move_name: varchar({ length: 150 }).notNull(),
  item_stock_id: int().notNull(),
  item_stock_name: varchar({ length: 150 }).notNull(),
  presentation_id: int().notNull(),
  presentation_name: varchar({ length: 150 }).notNull(),
  measure_id: int().notNull(),
  unit_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
  quantity: decimalNumber({ precision: 16, scale: 3 }).notNull().default(0),
  total_value: decimalNumber({ precision: 16, scale: 2 }).notNull().default(0),
});

export const templateItemsRelation = relations(templatesItems, ({ one }) => ({
  template: one(templates, {
    fields: [templatesItems.dispatch_id],
    references: [templates.id],
  }),
}));

export const templateRelation = relations(templates, ({ many }) => ({
  items: many(templatesItems),
}));

export const suppliers = mysqlTable("inv_supplier", {
  id: int().autoincrement().notNull().primaryKey(),
  supplier: varchar({ length: 150 }).notNull(),
  legal_name: varchar({ length: 150 }),
  legal_number: varchar({ length: 15 }),
  type_supplier: char({ length: 1 }).default("M"),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export type DispatchInsert = InferInsertModel<typeof dispatches>;
export type DispatchSelect = InferSelectModel<typeof dispatches>;
export type DispatchItemSelect = InferSelectModel<typeof dispatchesItems>;
export type DispatchItemInsert = InferInsertModel<typeof dispatchesItems>;

export type StockSelect = InferSelectModel<typeof stocks>;
export type StockInsert = InferInsertModel<typeof stocks>;
