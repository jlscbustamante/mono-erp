import { db } from "#app/database.ts";
import { IProduct } from "@scope/shared";
import { Hono } from "hono";
//import { IListaInsumo } from "./backend/shared/modules/recetas/index.ts";
/*import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
*/

export const productRouter = new Hono().get("/all", async (c) => {
  /*
  const queryExecuted = await db.execute("select Now() as fecha");

  const result = queryExecuted[0] as unknown as { fecha: string }[];
  console.log("res : ", result);
  return c.json({ data: result, message: "ok" });
  */

  //resultado con data, cero es la fila con datos
  //const result = queryExecuted[0] as unknown as IListaInsumo[];

  //const param1 = c.req.query("needle");
  //const param2 = c.req.query("cat_selected");
  const queryUnion = `select * from inv_menu_product;;`;
  //const queryFecha = "select Now() as fecha";
  const queryExecuted = await db.execute(queryUnion);

  const result = queryExecuted[0] as unknown as IProduct[];
  console.log("res : ", result);
  return c.json({ data: result, message: "ok" });
});
