import { z } from "zod";

export const ingredientSchema = z.object({
  item_id: z.number().int(),
  quantity: z.number().positive(),
  measure_id: z.number().int(),
  presentation_id: z.number().int(),
  source: z.enum(["base", "flavor", "extra"]),
});

export const createFinalRecipeSchema = z.object({
  product_id: z.number().int(),
  product_size_id: z.number().int(),
  recipe_base_id: z.number().int(),
  recipe_flavor_id: z.number().int().optional(),
  company_id: z.string().min(1),
  recipe_group: z.string().min(1),
  status: z.number().int().min(0).max(1),
  ingredients: z.array(ingredientSchema).min(1),
})

export const createBaseRecipeSchema = z.object({
  title: z.string().min(1),
  product_size_id: z.number().int(),
  company_id: z.string().min(1),
  ingredients: z.array(
    z.object({
      item_id: z.number().int(),
      quantity: z.number().positive(),
      measure_id: z.number().int(),
      presentation_id: z.number().int(),
    })
  ).min(1),
})

export const createFlavorWithIngredientsSchema = z.object({
  flavor: z.object({
    flavor: z.string().min(1),
    menuflav_id: z.number().int(),
    company_id: z.string().min(1),
  }),
  ingredients: z.array(
    z.object({
      item_id: z.number().int(),
      quantity: z.number().positive(),
      measure_id: z.number().int(),
      presentation_id: z.number().int(),
    })
  ).min(1),
})
