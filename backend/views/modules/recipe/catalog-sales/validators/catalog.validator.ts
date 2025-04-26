import { z } from "zod";

export const createProductSchema = z.object({
  company_id: z.string(),
  product: z.string().min(1),
  menuprod_id: z.number().int(),
  flavor_id: z.number().int(),
  size_id: z.number().int(),
})

export const createFlavorSchema = z.object({
  company_id: z.string(),
  flavor: z.string().min(1),
  menuflav_id: z.number().int(),
});

export const createSizeSchema = z.object({
  company_id: z.string(),
  size: z.string().min(1),
  menusize_id: z.number().int(),
});

export const createProductWithSizeAndFlavorSchema = z.object({
  product: createProductSchema,
  flavors: z.array(createFlavorSchema).optional(),
  sizes: z.array(createSizeSchema).optional(),
});

//Carga por lotes
export const createManyProductsSchema = z.array(createProductSchema);
export const createManyFlavorsSchema = z.array(createFlavorSchema);
export const createManySizesSchema = z.array(createSizeSchema);
export const createManyProductsWithSizesAndFlavorsSchema = z.array(createProductWithSizeAndFlavorSchema);