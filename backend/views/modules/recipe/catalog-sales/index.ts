import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { catalogService } from "./services/catalog.service.ts";
import {
  createProductSchema,
  createFlavorSchema,
  createSizeSchema,
  createManyProductsSchema,
  createManyFlavorsSchema,
  createManySizesSchema,
} from "./validators/catalog.validator.ts";

export const catalogRouter = new Hono()

  // POST: agregar producto
  .post(
    "/products/add",
    zValidator("json", createProductSchema),
    async (c) => {
        
      const body = c.req.valid("json");
      console.log(body);
      await catalogService.addProduct(body);
      return c.json({ message: "Producto agregado con éxito" }, 201);
    }
  )

  // POST: agregar sabor
  .post(
    "/flavors/add",
    zValidator("json", createFlavorSchema),
    async (c) => {
      const body = c.req.valid("json");
      await catalogService.addFlavor(body);
      return c.json({ message: "Sabor agregado con éxito" }, 201);
    }
  )

  // POST: agregar tamaño
  .post(
    "/sizes/add",
    zValidator("json", createSizeSchema),
    async (c) => {
      const body = c.req.valid("json");
      await catalogService.addSize(body);
      return c.json({ message: "Tamaño agregado con éxito" }, 201);
    }
  )

  // Agregar muchos productos
  .post(
    "/products/add-many",
    zValidator("json", createManyProductsSchema),
    async (c) => {
      const body = c.req.valid("json");
      await catalogService.addManyProducts(body);
      return c.json({ message: "Productos agregados con éxito" }, 201);
    }
  )
  
  // Agregar muchos sabores
  .post(
    "/flavors/add-many",
    zValidator("json", createManyFlavorsSchema),
    async (c) => {
      const body = c.req.valid("json");
      await catalogService.addManyFlavors(body);
      return c.json({ message: "Sabores agregados con éxito" }, 201);
    }
  )
  
  // Agregar muchos tamaños
  .post(
    "/sizes/add-many",
    zValidator("json", createManySizesSchema),
    async (c) => {
      const body = c.req.valid("json");
      await catalogService.addManySizes(body);
      return c.json({ message: "Tamaños agregados con éxito" }, 201);
    }
  )
    
  // Productos activos
  catalogRouter.get("/products", async (c) => {
    const products = await catalogService.getProductsFromDB();
    return c.json({ message: "OK", data: products });
  });
  
  // Sabores activos
  catalogRouter.get("/flavors", async (c) => {
    const flavors = await catalogService.getFlavorsFromDB();
    return c.json({ message: "OK", data: flavors });
  });
  
  // Tamaños activos
  catalogRouter.get("/sizes", async (c) => {
    const sizes = await catalogService.getSizesFromDB();
    return c.json({ message: "OK", data: sizes });
  });
