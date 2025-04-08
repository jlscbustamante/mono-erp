import { db } from "#app/database.ts";
import { eq } from "drizzle-orm";
import { inv_product, inv_product_flavor, inv_product_size } from "@pizzadb/schemas/recipe/catalog-sales/catalog.ts";

// Tipos esperados en el repo
import type {
  CreateProductDto,
  CreateFlavorDto,
  CreateSizeDto,
} from "../interfaces/catalog.dto.ts";

export const catalogRepository = {
  // ➕ Producto
  async insertProduct(dto: CreateProductDto) {
    await db.insert(inv_product).values({
      company_id: dto.company_id,
      product: dto.product,
      menuprod_id: dto.menuprod_id,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  // ➕ Sabor
  async insertFlavor(dto: CreateFlavorDto) {
    await db.insert(inv_product_flavor).values({
      company_id: dto.company_id,
      flavor: dto.flavor,
      menuflav_id: dto.menuflav_id,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },


  // ➕ Tamaño
  async insertSize(dto: CreateSizeDto) {
    await db.insert(inv_product_size).values({
      company_id: dto.company_id,
      size: dto.size,
      menusize_id: dto.menusize_id,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  // Inserción masiva de productos
  async insertManyProducts(data: CreateProductDto[]) {
    await db.insert(inv_product).values(
      data.map((d: CreateProductDto) => ({
        company_id: d.company_id,
        product: d.product,
        menuprod_id: d.menuprod_id,
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    );
  },

  // Inserción masiva de sabores
  async insertManyFlavors(data: CreateFlavorDto[]) {
    await db.insert(inv_product_flavor).values(
      data.map((d) => ({
        company_id: d.company_id,
        flavor: d.flavor,
        menuflav_id: d.menuflav_id,
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    );
  },
  
  // Inserción masiva de tamaños
  async insertManySizes(data: CreateSizeDto[]) {
    await db.insert(inv_product_size).values(
      data.map((d) => ({
        company_id: d.company_id,
        size: d.size,
        menusize_id: d.menusize_id,
        status: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    );
  },

    // 🔍 Listar productos sincronizados
  async getActiveProducts() {
    return db.select().from(inv_product).where(eq(inv_product.status, 1));
  },

  async getActiveFlavors() {
    return db.select().from(inv_product_flavor).where(eq(inv_product_flavor.status, 1));
  },

  async getActiveSizes() {
    return db.select().from(inv_product_size).where(eq(inv_product_size.status, 1));
  },
};
