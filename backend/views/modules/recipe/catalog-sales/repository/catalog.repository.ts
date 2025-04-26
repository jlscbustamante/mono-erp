import { db } from "#app/database.ts";
import { and, eq } from "drizzle-orm";

// Tipos esperados en el repo
import type {
  CreateProductDto,
  CreateFlavorDto,
  CreateSizeDto,
  SyncProductWithSizesAndFlavorsDto,
} from "../interfaces/catalog.dto.ts";
import {
companies,
  inv_product,
  inv_product_flavor,
  inv_product_size,
} from "@pizzadb/index.ts";

export const catalogRepository = {
  // ➕ Producto
  async insertProduct(dto: CreateProductDto) {
    const exists = await catalogRepository.existsProduct(
      dto.company_id,
      dto.menuprod_id
    );
    if (exists) return;

    // ⚠️ Usa los IDs reales
    const realFlavor = await db
      .select({ id: inv_product_flavor.id })
      .from(inv_product_flavor)
      .where(
        and(
          eq(inv_product_flavor.company_id, dto.company_id),
          eq(inv_product_flavor.menuflav_id, dto.flavor_id!)
        )
      )
      .then((r) => r[0]?.id);

    const realSize = await db
      .select({ id: inv_product_size.id })
      .from(inv_product_size)
      .where(
        and(
          eq(inv_product_size.company_id, dto.company_id),
          eq(inv_product_size.menusize_id, dto.size_id!)
        )
      )
      .then((r) => r[0]?.id);

    if (!realFlavor || !realSize) {
      throw new Error("No se pudo encontrar flavor_id o size_id real en la BD");
    }

    await db.insert(inv_product).values({
      company_id: dto.company_id,
      product: dto.product,
      menuprod_id: dto.menuprod_id.toString(),
      flavor_id: realFlavor,
      size_id: realSize,
      status: 1,
    });
  },

  // ➕ Sabor
  async insertFlavor(dto: CreateFlavorDto) {
    const exists = await catalogRepository.existsFlavor(
      dto.company_id,
      dto.menuflav_id
    );
    if (exists) return;

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
    const exists = await catalogRepository.existsSize(
      dto.company_id,
      dto.menusize_id
    );
    if (exists) return;

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
    const existing = await db
      .select({
        company_id: inv_product.company_id,
        menuprod_id: inv_product.menuprod_id,
      })
      .from(inv_product);

    const existingSet = new Set(
      existing.map((p) => `${p.company_id}-${p.menuprod_id}`)
    );

    const productsToInsert = data.filter((d) => {
      const key = `${d.company_id}-${d.menuprod_id}`;
      if (existingSet.has(key)) return false;
      existingSet.add(key);
      return true;
    });

    if (productsToInsert.length === 0) return;

    // 🔎 1. Traer todas las flavors y sizes de la base de datos de una sola vez
    const allFlavors = await db
      .select({
        id: inv_product_flavor.id,
        company_id: inv_product_flavor.company_id,
        menuflav_id: inv_product_flavor.menuflav_id,
      })
      .from(inv_product_flavor);

    const allSizes = await db
      .select({
        id: inv_product_size.id,
        company_id: inv_product_size.company_id,
        menusize_id: inv_product_size.menusize_id,
      })
      .from(inv_product_size);

    const flavorMap = new Map<string, number>();
    const sizeMap = new Map<string, number>();

    for (const f of allFlavors) {
      flavorMap.set(`${f.company_id}-${f.menuflav_id}`, f.id);
    }

    for (const s of allSizes) {
      sizeMap.set(`${s.company_id}-${s.menusize_id}`, s.id);
    }

    // 🔥 2. Mapear productos, resolviendo flavor_id y size_id reales
    const insertPayload = productsToInsert.map((p) => {
      const resolvedFlavorId = flavorMap.get(`${p.company_id}-${p.flavor_id}`);
      const resolvedSizeId = sizeMap.get(`${p.company_id}-${p.size_id}`);

      if (!resolvedFlavorId || !resolvedSizeId) {
        throw new Error(
          `No se encontró el flavor o size real para el producto ${p.product}`
        );
      }

      return {
        company_id: p.company_id,
        product: p.product,
        menuprod_id: p.menuprod_id.toString(),
        flavor_id: resolvedFlavorId,
        size_id: resolvedSizeId,
        status: 1,
      };
    });

    // ✅ 3. Ahora sí insertamos todo correcto
    await db.insert(inv_product).values(insertPayload);
  },

  // Inserción masiva de sabores
  async insertManyFlavors(data: CreateFlavorDto[]) {
    const existing = await db
      .select({
        company_id: inv_product_flavor.company_id,
        menuflav_id: inv_product_flavor.menuflav_id,
      })
      .from(inv_product_flavor);

    const existingSet = new Set(
      existing.map((f) => `${f.company_id}-${f.menuflav_id}`)
    );

    const unique = data.filter((d) => {
      const key = `${d.company_id}-${d.menuflav_id}`;
      if (existingSet.has(key)) return false;
      existingSet.add(key);
      return true;
    });

    if (unique.length === 0) return;

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
    const existing = await db
      .select({
        company_id: inv_product_size.company_id,
        menusize_id: inv_product_size.menusize_id,
      })
      .from(inv_product_size);

    const existingSet = new Set(
      existing.map((s) => `${s.company_id}-${s.menusize_id}`)
    );

    const unique = data.filter((d) => {
      const key = `${d.company_id}-${d.menusize_id}`;
      if (existingSet.has(key)) return false;
      existingSet.add(key);
      return true;
    });

    if (unique.length === 0) return;

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
    return db
      .select({
        id: inv_product.id,
        product: inv_product.product,
        company_id: inv_product.company_id,
        menuprod_id: inv_product.menuprod_id,
        flavor_id: inv_product.flavor_id,
        size_id: inv_product.size_id,
        status: inv_product.status,
        // Extras necesarios para ProductSyncedDto:
        flavor: inv_product_flavor.flavor,
        size: inv_product_size.size,
        company_title: inv_product.company_id,// <-- IMPORTANTE: asegúrate que inv_product tenga category_id
      })
      .from(inv_product)
      .where(eq(inv_product.status, 1))
      .leftJoin(inv_product_flavor, eq(inv_product.flavor_id, inv_product_flavor.id))
      .leftJoin(inv_product_size, eq(inv_product.size_id, inv_product_size.id))
      .leftJoin(companies, eq(inv_product.company_id, companies.id));
  },

  async getActiveFlavors() {
    return db
      .select()
      .from(inv_product_flavor)
      .where(eq(inv_product_flavor.status, 1));
  },

  async getActiveSizes() {
    return db
      .select()
      .from(inv_product_size)
      .where(eq(inv_product_size.status, 1));
  },

  //utilidades

  async existsProduct(company_id: string, menuprod_id: number) {
    const result = await db
      .select()
      .from(inv_product)
      .where(
        and(
          eq(inv_product.company_id, company_id),
          eq(inv_product.menuprod_id, menuprod_id.toString())
        )
      )
      .limit(1);

    return result.length > 0; // Retorna true si existe el producto
  },

  async existsFlavor(company_id: string, menuflav_id: number) {
    const result = await db
      .select()
      .from(inv_product_flavor)
      .where(
        and(
          eq(inv_product_flavor.company_id, company_id),
          eq(inv_product_flavor.menuflav_id, menuflav_id)
        )
      )
      .limit(1);

    return result.length > 0; // Retorna true si existe el sabor
  },

  async existsSize(company_id: string, menusize_id: number) {
    const result = await db
      .select()
      .from(inv_product_size)
      .where(
        and(
          eq(inv_product_size.company_id, company_id),
          eq(inv_product_size.menusize_id, menusize_id)
        )
      )
      .limit(1);

    return result.length > 0; // Retorna true si existe el tamaño
  },

  async insertManyProductsWithSizesAndFlavors(data: SyncProductWithSizesAndFlavorsDto[]) {
    return db.transaction(async (tx) => {
      const productsToInsert: CreateProductDto[] = [];
      const sizesToInsert: CreateSizeDto[] = [];
      const flavorsToInsert: CreateFlavorDto[] = [];
  
      const existingProducts = new Set<string>();
      const existingSizes = new Set<string>();
      const existingFlavors = new Set<string>();
  
      const dbProducts = await tx.select({
        company_id: inv_product.company_id,
        menuprod_id: inv_product.menuprod_id,
      }).from(inv_product);
  
      const dbSizes = await tx.select({
        company_id: inv_product_size.company_id,
        menusize_id: inv_product_size.menusize_id,
      }).from(inv_product_size);
  
      const dbFlavors = await tx.select({
        company_id: inv_product_flavor.company_id,
        menuflav_id: inv_product_flavor.menuflav_id,
      }).from(inv_product_flavor);
  
      for (const p of dbProducts) {
        existingProducts.add(`${p.company_id}-${p.menuprod_id}`);
      }
      for (const s of dbSizes) {
        existingSizes.add(`${s.company_id}-${s.menusize_id}`);
      }
      for (const f of dbFlavors) {
        existingFlavors.add(`${f.company_id}-${f.menuflav_id}`);
      }
  
      for (const item of data) {
        const { product, sizes = [], flavors = [] } = item;
  
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
  
        const productKey = `${product.company_id}-${product.menuprod_id}`;
        if (!existingProducts.has(productKey)) {
          productsToInsert.push(product);
          existingProducts.add(productKey);
        }
      }
  
      // ✅ Paso 1: Insertar tamaños
      if (sizesToInsert.length > 0) {
        await tx.insert(inv_product_size).values(
          sizesToInsert.map((s) => ({
            company_id: s.company_id,
            size: s.size,
            menusize_id: s.menusize_id,
            status: 1,
          }))
        );
      }
  
      // ✅ Paso 2: Insertar sabores
      if (flavorsToInsert.length > 0) {
        await tx.insert(inv_product_flavor).values(
          flavorsToInsert.map((f) => ({
            company_id: f.company_id,
            flavor: f.flavor,
            menuflav_id: f.menuflav_id,
            status: 1,
          }))
        );
      }
  
      // ✅ Paso 3: Insertar productos
      if (productsToInsert.length > 0) {
        // Obtener flavors y sizes ya insertados
        const allFlavors = await tx.select({
          id: inv_product_flavor.id,
          company_id: inv_product_flavor.company_id,
          menuflav_id: inv_product_flavor.menuflav_id,
        }).from(inv_product_flavor);
  
        const allSizes = await tx.select({
          id: inv_product_size.id,
          company_id: inv_product_size.company_id,
          menusize_id: inv_product_size.menusize_id,
        }).from(inv_product_size);
  
        const flavorMap = new Map<string, number>();
        const sizeMap = new Map<string, number>();
  
        for (const f of allFlavors) {
          flavorMap.set(`${f.company_id}-${f.menuflav_id}`, f.id);
        }
  
        for (const s of allSizes) {
          sizeMap.set(`${s.company_id}-${s.menusize_id}`, s.id);
        }
  
        const productsPayload = productsToInsert.map((p) => {
          const resolvedFlavorId = flavorMap.get(`${p.company_id}-${p.flavor_id}`);
          const resolvedSizeId = sizeMap.get(`${p.company_id}-${p.size_id}`);
  
          if (!resolvedFlavorId || !resolvedSizeId) {
            throw new Error(`No se encontró el flavor o size real para el producto ${p.product}`);
          }
  
          return {
            company_id: p.company_id,
            product: p.product,
            menuprod_id: p.menuprod_id.toString(),
            flavor_id: resolvedFlavorId,
            size_id: resolvedSizeId,
            status: 1,
          };
        });
  
        await tx.insert(inv_product).values(productsPayload);
      }
  
      return {
        insertedProducts: productsToInsert.length,
        insertedSizes: sizesToInsert.length,
        insertedFlavors: flavorsToInsert.length,
      };
    });
  },

  async insertProductWithSizesAndFlavors(
    data: SyncProductWithSizesAndFlavorsDto
  ) {
    const { product, sizes = [], flavors = [] } = data;

    const productKey = `${product.company_id}-${product.menuprod_id}`;
    const sizeKeys = sizes.map((s) => `${s.company_id}-${s.menusize_id}`);
    const flavorKeys = flavors.map((f) => `${f.company_id}-${f.menuflav_id}`);

    const existingProducts = new Set<string>();
    const existingSizes = new Set<string>();
    const existingFlavors = new Set<string>();

    const dbProducts = await db
      .select({
        company_id: inv_product.company_id,
        menuprod_id: inv_product.menuprod_id,
      })
      .from(inv_product);

    const dbSizes = await db
      .select({
        company_id: inv_product_size.company_id,
        menusize_id: inv_product_size.menusize_id,
      })
      .from(inv_product_size);

    const dbFlavors = await db
      .select({
        company_id: inv_product_flavor.company_id,
        menuflav_id: inv_product_flavor.menuflav_id,
      })
      .from(inv_product_flavor);

    for (const p of dbProducts) {
      existingProducts.add(`${p.company_id}-${p.menuprod_id}`);
    }
    for (const s of dbSizes) {
      existingSizes.add(`${s.company_id}-${s.menusize_id}`);
    }
    for (const f of dbFlavors) {
      existingFlavors.add(`${f.company_id}-${f.menuflav_id}`);
    }
    const sizesToInsert = sizes.filter(
      (s) => !existingSizes.has(`${s.company_id}-${s.menusize_id}`)
    );
    const flavorsToInsert = flavors.filter(
      (f) => !existingFlavors.has(`${f.company_id}-${f.menuflav_id}`)
    );

    if (sizesToInsert.length > 0) {
      await catalogRepository.insertManySizes(sizesToInsert);
    }
    console.log("tamaños insertados");

    if (flavorsToInsert.length > 0) {
      await catalogRepository.insertManyFlavors(flavorsToInsert);
    }
    console.log("sabores insertados");

    // 🔍 Obtener los ids reales
    const size = await db
      .select({ id: inv_product_size.id })
      .from(inv_product_size)
      .where(
        and(
          eq(inv_product_size.company_id, product.company_id),
          eq(inv_product_size.menusize_id, product.size_id)
        )
      )
      .then((r) => r[0]?.id);

    const flavor = await db
      .select({ id: inv_product_flavor.id })
      .from(inv_product_flavor)
      .where(
        and(
          eq(inv_product_flavor.company_id, product.company_id),
          eq(inv_product_flavor.menuflav_id, product.flavor_id)
        )
      )
      .then((r) => r[0]?.id);

    if (!size || !flavor) {
      throw new Error(
        "No se pudo resolver el ID de size o flavor para insertar el producto"
      );
    }

    if (!existingProducts.has(productKey)) {
      await catalogRepository.insertProduct(product);
    }

    return {
      insertedProduct: product,
      insertedSizes: sizesToInsert.length,
      insertedFlavors: flavorsToInsert.length,
    };
  },
};
