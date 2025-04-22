import { db } from "#app/database.ts";
import { and, eq } from "drizzle-orm";

// Tipos esperados en el repo
import type {
  CreateProductDto,
  CreateFlavorDto,
  CreateSizeDto,
  SyncProductWithSizesAndFlavorsDto,
} from "../interfaces/catalog.dto.ts";
import { inv_product, inv_product_flavor, inv_product_size } from "@pizzadb/index.ts";

export const catalogRepository = {
  // ➕ Producto
  async insertProduct(dto: CreateProductDto) {
    await db.insert(inv_product).values({
      company_id: dto.company_id,
      product: dto.product,
      menuprod_id: dto.menuprod_id,
      status: 1,
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(),
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
      // created_at: new Date().toISOString(),
      // updated_at: new Date().toISOString(),
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
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
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
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
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
        // created_at: new Date().toISOString(),
        // updated_at: new Date().toISOString(),
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

  //utilidades

  async existsProduct(company_id: string, menuprod_id: number) {
    const result = await db.select().from(inv_product).where(
      and(
        eq(inv_product.company_id, company_id),
        eq(inv_product.menuprod_id, menuprod_id),
      )).limit(1);
      
    return result.length > 0; // Retorna true si existe el producto
  },

  async existsFlavor(company_id: string, menuflav_id: number) {
    const result = await db.select().from(inv_product_flavor).where(
      and(
        eq(inv_product_flavor.company_id, company_id),
        eq(inv_product_flavor.menuflav_id, menuflav_id),
      )).limit(1);
      
    return result.length > 0; // Retorna true si existe el sabor
  },

  async existsSize(company_id: string, menusize_id: number) {
    const result = await db.select().from(inv_product_size).where(
      and(
        eq(inv_product_size.company_id, company_id),
        eq(inv_product_size.menusize_id, menusize_id),
      )).limit(1);
      
    return result.length > 0; // Retorna true si existe el tamaño
  },

  async insertManyProductsWithSizesAndFlavors(data: SyncProductWithSizesAndFlavorsDto[]) {
    // Crea sets para evitar duplicados antes de insertar
    const productsToInsert: CreateProductDto[] = [];
    const sizesToInsert: CreateSizeDto[] = [];
    const flavorsToInsert: CreateFlavorDto[] = [];
  
    // Guarda las combinaciones existentes para evitar insertarlas dos veces
    const existingProducts = new Set<string>();
    const existingSizes = new Set<string>();
    const existingFlavors = new Set<string>();
  
    // Carga datos ya existentes de la base de datos
    const dbProducts = await db.select({
      company_id: inv_product.company_id,
      menuprod_id: inv_product.menuprod_id
    }).from(inv_product);
  
    const dbSizes = await db.select({
      company_id: inv_product_size.company_id,
      menusize_id: inv_product_size.menusize_id
    }).from(inv_product_size);
  
    const dbFlavors = await db.select({
      company_id: inv_product_flavor.company_id,
      menuflav_id: inv_product_flavor.menuflav_id
    }).from(inv_product_flavor);
  
    // Llena los sets con registros existentes
    for (const p of dbProducts) {
      existingProducts.add(`${p.company_id}-${p.menuprod_id}`);
    }
  
    for (const s of dbSizes) {
      existingSizes.add(`${s.company_id}-${s.menusize_id}`);
    }
  
    for (const f of dbFlavors) {
      existingFlavors.add(`${f.company_id}-${f.menuflav_id}`);
    }
  
    // Evalúa el nuevo batch
    for (const item of data) {
      const { product, sizes = [], flavors = [] } = item;
  
      const productKey = `${product.company_id}-${product.menuprod_id}`;
      if (!existingProducts.has(productKey)) {
        productsToInsert.push(product);
        existingProducts.add(productKey);
      }
  
      for (const size of sizes) {
        const sizeKey = `${size.company_id}-${size.menusize_id}`;
        if (!existingSizes.has(sizeKey)) {
          sizesToInsert.push(size);
          existingSizes.add(sizeKey);
        }
      }
  
      for (const flavor of flavors) {
        const flavorKey = `${flavor.company_id}-${flavor.menuflav_id}`;
        if (!existingFlavors.has(flavorKey)) {
          flavorsToInsert.push(flavor);
          existingFlavors.add(flavorKey);
        }
      }
    }
  
    // Inserta los únicos
    if (productsToInsert.length > 0) {
      await catalogRepository.insertManyProducts(productsToInsert);
    }
  
    if (sizesToInsert.length > 0) {
      await catalogRepository.insertManySizes(sizesToInsert);
    }
  
    if (flavorsToInsert.length > 0) {
      await catalogRepository.insertManyFlavors(flavorsToInsert);
    }
  
    return {
      insertedProducts: productsToInsert.length,
      insertedSizes: sizesToInsert.length,
      insertedFlavors: flavorsToInsert.length,
    };
  },

  async insertProductWithSizesAndFlavors(data: SyncProductWithSizesAndFlavorsDto) {
    const productToInsert: CreateProductDto = data.product;
    const sizesToInsert: CreateSizeDto[] = [];
    const flavorsToInsert: CreateFlavorDto[] = [];

    // Guarda las combinaciones existentes para evitar insertarlas dos veces
    const existingProducts = new Set<string>();
    const existingSizes = new Set<string>();
    const existingFlavors = new Set<string>();
  
    // Carga datos ya existentes de la base de datos
    const dbProducts = await db.select({
      company_id: inv_product.company_id,
      menuprod_id: inv_product.menuprod_id
    }).from(inv_product);
  
    const dbSizes = await db.select({
      company_id: inv_product_size.company_id,
      menusize_id: inv_product_size.menusize_id
    }).from(inv_product_size);
  
    const dbFlavors = await db.select({
      company_id: inv_product_flavor.company_id,
      menuflav_id: inv_product_flavor.menuflav_id
    }).from(inv_product_flavor);

    // Llena los sets con registros existentes
    for (const p of dbProducts) {
      existingProducts.add(`${p.company_id}-${p.menuprod_id}`);
    }
  
    for (const s of dbSizes) {
      existingSizes.add(`${s.company_id}-${s.menusize_id}`);
    }
  
    for (const f of dbFlavors) {
      existingFlavors.add(`${f.company_id}-${f.menuflav_id}`);
    }

    // Evalúa el nuevo batch    
    const { sizes = [], flavors = [] } = data;

    const productKey = `${productToInsert.company_id}-${productToInsert.menuprod_id}`;
    if (!existingProducts.has(productKey)) {
      await catalogRepository.insertProduct(productToInsert);
      existingProducts.add(productKey);
    }
    for (const size of sizes) {
      const sizeKey = `${size.company_id}-${size.menusize_id}`;
      if (!existingSizes.has(sizeKey)) {
        sizesToInsert.push(size);
        existingSizes.add(sizeKey);
      }
    }
    for (const flavor of flavors) {
      const flavorKey = `${flavor.company_id}-${flavor.menuflav_id}`;
      if (!existingFlavors.has(flavorKey)) {
        flavorsToInsert.push(flavor);
        existingFlavors.add(flavorKey);
      }
    }

    // Inserta los únicos
    if (sizesToInsert.length > 0) {
      await catalogRepository.insertManySizes(sizesToInsert);
    }
    if (flavorsToInsert.length > 0) {
      await catalogRepository.insertManyFlavors(flavorsToInsert);
    }
    return {
      insertedProduct: productToInsert, 
      insertedSizes: sizesToInsert.length,
      insertedFlavors: flavorsToInsert.length,
    };
  }
};
