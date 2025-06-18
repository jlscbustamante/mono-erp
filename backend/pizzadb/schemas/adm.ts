import dayjs from "dayjs";
import { relations } from "drizzle-orm";
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
import { cashBanks } from "./fin.ts";
import { suppliers } from "./inv.ts";

export const companies = mysqlTable("adm_company", {
  id: varchar({ length: 10 }).notNull().primaryKey(),
  title: varchar({ length: 150 }).notNull(),
  razon_social: varchar({ length: 250 }),
  nro_ruc: varchar({ length: 15 }),
  /**
   * @description C: comercial
   */
  type_company: char({ length: 1 }).notNull(),
  has_accounting: smallint().notNull().default(1),
  status: smallint().notNull().default(1),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const requirements = mysqlTable("adm_request", {
  id: int().autoincrement().notNull().primaryKey(),
  company_id: varchar({ length: 10 }),
  /**
   * @description U: Proveedor; S: Simple; T: Transferencia; L: Liquidacion
   */
  request_type: char({ length: 1 }),
  description: varchar({ length: 250 }),
  supplier_id: int(),
  legal_number: varchar({ length: 15 }),
  legal_name: varchar({ length: 150 }),
  /**
   * @description 01 Factura; 03 Boleta; 04 Ticket de Salida; 07 Nota de crédito; 08 Nota de débito; 09 Guia remisión; 31 Guia transportista
   */
  type_document: varchar({ length: 2 }),
  num_document: varchar({ length: 210 }),
  purchase_id: int(),
  movecash_id: int(),
  movecash_name: varchar({ length: 150 }),
  costcenter_id: int(),
  costcenter_name: varchar({ length: 150 }),
  amount: decimalNumber(),
  amount_net: decimalNumber(),
  amount_ret: decimalNumber(),
  /**
   * @description CONTADO; CREDITO
   */
  pay_method: varchar({ length: 20 }),
  nro_quotas: smallint(),
  requested_at: datetime({ mode: "string", fsp: 2 }),
  created_by: varchar({ length: 100 }),
  /**
   * @description S: Solicitado; A: Aprobado; R: Rechazado; P: Pagado
   */
  status: char({ length: 1 }).notNull(),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const requirementItems = mysqlTable("adm_request_item", {
  id: int().autoincrement().notNull().primaryKey(),
  request_id: int().notNull(),
  description: varchar({ length: 250 }),
  purchase_id: int(),
  /**
   * @description 0:No tiene, 1:Si tiene
   */
  retention: char({ length: 1 }),
  amount: decimalNumber().notNull(),
  amount_net: decimalNumber(),
  amount_ret: decimalNumber(),
  doc_url: varchar({ length: 250 }),
  /**
   * @description Template para el asiento contable
   */
  tmplt_bookentry_id: int(),
  cashbank_id: int(),
  cashbank_name: varchar({ length: 150 }),
  expires_at: datetime({ mode: "string", fsp: 2 }),
  requested_at: datetime({ mode: "string", fsp: 2 }),
  approved_at: datetime({ mode: "string", fsp: 2 }),
  rejected_at: datetime({ mode: "string", fsp: 2 }),
  created_by: varchar({ length: 100 }),
  approved_by: varchar({ length: 100 }),
  paid_by: varchar({ length: 100 }),
  rejected_by: varchar({ length: 100 }),
  /**
   * @description S: Solicitado; A: Aprobado; R: Rechazado; P: Pagado
   */
  status: char({ length: 1 }),
  created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  ),
  updated_at: timestamp({ mode: "string", fsp: 2 })
    .notNull()
    .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
});

export const requirementItemsRelation = relations(
  requirementItems,
  ({ one }) => ({
    requirement: one(requirements, {
      fields: [requirementItems.request_id],
      references: [requirements.id],
    }),
    cashbank: one(cashBanks, {
      fields: [requirementItems.cashbank_id],
      references: [cashBanks.id],
    }),
  })
);

export const requirementRelation = relations(requirements, ({ many, one }) => ({
  items: many(requirementItems),
  supplier: one(suppliers, {
    fields: [requirements.supplier_id],
    references: [suppliers.id],
  }),
}));

export const storeTable = mysqlTable("adm_sucursal", {
  id: varchar({ length: 11 }).notNull().primaryKey(),
  title: varchar({ length: 150 }).notNull(),
  company_id: varchar({ length: 10 }),
  /**
   * @description T: Tienda, A: Almacen, O: Oficina
   */
  type_sede: char({ length: 1 }).notNull(),
});
