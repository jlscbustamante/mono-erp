import { db } from "#app/database.ts";
import { inv_recipemix_detail,inv_recipe_base, inv_recipemix_base, inv_product_flavor, inv_recipemix_flavor, inv_product, inv_measure, inv_item } from "@pizzadb/index.ts";
import { CreateBaseRecipeDto, CreateFinalRecipeDto, CreateFlavorWithIngredientsDto } from "../interfaces/recipe.dto.ts";
import { eq } from "drizzle-orm/expressions";



export const recipeRepository = {
  async insertFinalRecipe(data: CreateFinalRecipeDto) {
    const rows = data.ingredients.map(i => ({
      company_id: data.company_id,
      product_id: data.product_id,
      product_flavor_id: data.recipe_flavor_id ?? null,
      product_size_id: data.product_size_id,
      recipe_base_id: data.recipe_base_id,
      recipe_flavor_id: data.recipe_flavor_id ?? null,
      item_id: i.item_id,
      quantity: i.quantity,
      measure_id: i.measure_id,
      presentation_id: i.presentation_id,
      recipe_group: data.recipe_group,
      status: data.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  
    await db.insert(inv_recipemix_detail).values(rows)
  },

  async insertBaseRecipe(data: CreateBaseRecipeDto) {
    const inserted = await db.insert(inv_recipe_base).values({
      title: data.title,
      product_size_id: data.product_size_id,
      company_id: data.company_id,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).$returningId();

    const recipeBaseId = inserted[0].id

    const rows = data.ingredients.map(i => ({
      recipe_base_id: recipeBaseId,
      item_id: i.item_id,
      company_id: data.company_id,
      quantity: i.quantity,
      measure_id: i.measure_id,
      presentation_id: i.presentation_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    await db.insert(inv_recipemix_base).values(rows)
  },

  async insertFlavorWithIngredients(data: CreateFlavorWithIngredientsDto) {
    const inserted = await db.insert(inv_product_flavor).values({
      flavor: data.flavor.flavor,
      menuflav_id: data.flavor.menuflav_id,
      company_id: data.flavor.company_id,
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).$returningId();

    const flavorId = inserted[0].id

    const rows = data.ingredients.map(i => ({
      flavor_id: flavorId,
      item_id: i.item_id,
      quantity: i.quantity,
      company_id: data.flavor.company_id,
      measure_id: i.measure_id,
      presentation_id: i.presentation_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    await db.insert(inv_recipemix_flavor).values(rows)
  },

  async getBaseRecipesBySize(sizeId: number) {
    return await db.query.inv_recipe_base.findMany({
      where: (r, { eq }) => eq(r.product_size_id, sizeId),
      with: {
        ingredients: {
          columns: {
            id: true,
            recipe_base_id: true,
            item_id: true,
            quantity: true,
            measure_id: true,
            presentation_id: true,
            created_at: true,
            updated_at: true,
          },
          with: {
            item: {
              columns: {
                item_name: true,
              }
            }
          }
        }
      }
    })
  },
  
  async getActiveFlavors(/* future: productId?: number */) {
    return await db.query.inv_product_flavor.findMany({
      where: (r, { eq }) => eq(r.status, 1),
      with: {
        ingredients: {
          columns: {
            id: true,
            flavor_id: true,
            item_id: true,
            quantity: true,
            measure_id: true,
            presentation_id: true,
          },
          with: {
            item: {
              columns: {
                item_name: true,
              }
            }
          }
        }
      }
    })
  },

  async getActiveFinalRecipesGrouped() {
    const rows = await db
  .select({
    product_id: inv_recipemix_detail.product_id,
    recipe_group: inv_recipemix_detail.recipe_group,
    quantity: inv_recipemix_detail.quantity,
    measure_code: inv_measure.code,
    item_name: inv_item.item_name,
    product_name: inv_product.product,
    item_id: inv_recipemix_detail.item_id
  })
  .from(inv_recipemix_detail)
  .innerJoin(inv_product, eq(inv_recipemix_detail.product_id, inv_product.id))
  .innerJoin(inv_item, eq(inv_recipemix_detail.item_id, inv_item.id))
  .innerJoin(inv_measure, eq(inv_recipemix_detail.measure_id, inv_measure.id))
  .where(eq(inv_recipemix_detail.status, 1))
  
    // Agrupamos por recipe_group + product_id
    const grouped = rows.reduce((acc, row) => {
      const key = `${row.product_id}-${row.recipe_group}`
  
      if (!acc[key]) {
        acc[key] = {
          product_id: row.product_id,
          product_name: row.product_name ?? 'Desconocido',
          recipe_group: row.recipe_group,
          ingredients: []
        }
      }
  
      acc[key].ingredients.push({
        item_id: row.item_id,
        name: row.item_name ?? 'Item',
        quantity: row.quantity,
        measure: row.measure_code ?? ''
      })
  
      return acc
    }, {} as Record<string, any>)
  
    return Object.values(grouped)
  } 
}