import { char, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const requirements = mysqlTable("adm_request", {
  id: int().autoincrement().notNull().primaryKey(),
  company_id: varchar({ length: 10 }),
  /**
   * @description U: Proveedor; S: Simple; T: Transferencia; L: Liquidacion
   */
  request_type: char({ length: 1 }),
  description: varchar({ length: 250 }),
  supplier_id: int().notNull(),
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
});
