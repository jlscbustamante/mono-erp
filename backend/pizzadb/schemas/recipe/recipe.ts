// pizzadb/schema/catalog.ts
import {
    mysqlTable,
    int,
    varchar,
    smallint,
    datetime,
    char,
    timestamp,
  } from "drizzle-orm/mysql-core"
  import dayjs from "dayjs";
  import { decimalNumber } from "../../drizzle-extend.ts";

  
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

  
  export const inv_recipemix_detail = mysqlTable("inv_recipemix_detail", {
      id: int("id").primaryKey().autoincrement(),
      company_id: varchar("company_id", { length: 10 }).notNull(),
      product_id: int("product_id").notNull(),
      product_flavor_id: int("product_flavor_id"), // puede ser null
      product_size_id: int("product_size_id").notNull(),
      recipe_base_id: int("recipe_base_id").notNull(),
      recipe_flavor_id: int("recipe_flavor_id"), // puede ser null
    
      item_id: int("item_id").notNull(),
      quantity: decimalNumber("quantity", { precision: 16, scale: 3 }).notNull(),
    
      measure_id: int("measure_id").notNull(),
      presentation_id: int("presentation_id").notNull(),
    
      recipe_group: varchar("recipe_group", { length: 10 }).notNull(), // 'base', 'flavor', 'extra'
    
      status: smallint("status").notNull().default(1),
    
      created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
        dayjs().format("YYYY-MM-DD HH:mm:ss")
      ),
      updated_at: timestamp({ mode: "string", fsp: 2 })
        .notNull()
        .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  });

  export const inv_recipe_base = mysqlTable("inv_recipe_base", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    title: varchar("title", { length: 150 }).notNull(),
    product_size_id: int("product_size_id"), // Puede ser null
    status: smallint("status").notNull().default(1),
  
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
      .notNull()
      .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  });
  
  export const inv_recipemix_base = mysqlTable("inv_recipemix_base", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    recipe_base_id: int("recipe_base_id").notNull(),
    item_id: int("item_id").notNull(),
    quantity: decimalNumber("quantity", { precision: 16, scale: 3 }).notNull().default(0.0),
    presentation_id: int("presentation_id"), // puede ser null
    measure_id: int("measure_id"), // puede ser null
  
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
      .notNull()
      .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  });
  
  export const inv_recipemix_flavor = mysqlTable("inv_recipemix_flavor", {
    id: int("id").primaryKey().autoincrement(),
    company_id: varchar("company_id", { length: 10 }).notNull(),
    flavor_id: int("flavor_id").notNull(),
    item_id: int("item_id").notNull(),
    quantity: decimalNumber("quantity", { precision: 16, scale: 3 }).notNull().default(0.0),
    presentation_id: int("presentation_id"), // puede ser null
    measure_id: int("measure_id"), // puede ser null
  
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 })
      .notNull()
      .$onUpdate(() => dayjs().format("YYYY-MM-DD HH:mm:ss")),
  });
  
  export const inv_item = mysqlTable("inv_item", {
    id: int("id").primaryKey().autoincrement(),
    item_code: varchar("item_code", { length: 10 }).notNull(),
    item_name: varchar("item_name", { length: 150 }).notNull(),
    item_type: char("item_type", { length: 1 }).notNull().default("D"),
  
    category_id: int("category_id"),
    subcategory_id: int("subcategory_id"),
  
    supplier_id: int("supplier_id").notNull(),
    brand_id: int("brand_id").notNull(),
    presentation_id: int("presentation_id").notNull(),
  
    item_used_to: char("item_used_to", { length: 1 }),
  
    measure_id: int("measure_id"),
  
    unit_cost: decimalNumber("unit_cost", { precision: 16, scale: 2 }).notNull().default(0.00),
    unit_price: decimalNumber("unit_price", { precision: 16, scale: 2 }).notNull().default(0.00),
  
    status: smallint("status").notNull().default(1),
  
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 }).notNull().$onUpdate(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
  
    old_product_id: int("old_product_id"),
  });

  export const inv_measure = mysqlTable("inv_measure", {
    id: int("id").primaryKey().autoincrement(),
    measure: varchar("measure", { length: 50 }).notNull(),
    code: varchar("code", { length: 5 }),
    status: smallint("status").notNull().default(1),
  
    created_at: datetime({ mode: "string", fsp: 2 }).$defaultFn(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
    updated_at: timestamp({ mode: "string", fsp: 2 }).notNull().$onUpdate(() =>
      dayjs().format("YYYY-MM-DD HH:mm:ss")
    ),
  });