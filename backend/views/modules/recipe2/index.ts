import { db } from "#app/database.ts";
import { IItem, IListaInsumo } from "@scope/shared";
import { Hono } from "hono";
import {
  inv_recipe,
  inv_recipe_mix,
} from "../../../pizzadb/schemas/recipe/recipe.ts";
//import { IListaInsumo } from "./backend/shared/modules/recetas/index.ts";
/*import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
*/

export const recipeRouter = new Hono()
  .get("/filter/insumos", async (c) => {
    /*
  const queryExecuted = await db.execute("select Now() as fecha");

  const result = queryExecuted[0] as unknown as { fecha: string }[];
  console.log("res : ", result);
  return c.json({ data: result, message: "ok" });
  */

    //resultado con data, cero es la fila con datos
    //const result = queryExecuted[0] as unknown as IListaInsumo[];

    const param1 = c.req.query("needle");
    const param2 = c.req.query("cat_selected");
    const queryUnion = `select imp.id as item_id, imp.product as item_name
, null as "category_id", null as "category_name" 
, imp.id as product_id, imp.product as product_name, imp.recipe_req
, null as recollect_id, null as collection_name
 from inv_menu_product imp
inner join inv_menu_items imi
on imp.id = imi.product_id
inner join inv_recipe ir
on imi.id = ir.menu_item_id
where imp.product like '%${param1}%'
union
select 
 irc.id as item_id, irc.collection as item_name
, null as category_id, null as category_name 
, null as product_id, null as product_name, null as recipe_req
,irc.id as recollect_id, irc.collection _name
from inv_recollection irc
where irc.collection like '%${param1}%'
union
select ii.id as item_id, ii.item_name
, ic.id as category_id, ic.category as category_name
, null as product_id, null as product_name, null as recipe_req
, null as recollect_id, null as collection_name
from inv_item ii 
left join inv_category ic
on ii.category_id = ic.id
where ii.item_name like '%${param1}%'`;

    //const queryFecha = "select Now() as fecha";
    const queryExecuted = await db.execute(queryUnion);

    const result = queryExecuted[0] as unknown as IListaInsumo[];
    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .get("/items", async (c) => {
    const param1 = c.req.query("item_id");

    const queryUnion = `select ii.id, ii.item_name from inv_menu_items imi
inner join inv_recipe irc
on imi.id = irc.menu_item_id
inner join inv_recipe_mix irm
on irc.id = irm.recipe_id
inner join inv_item ii
on irm.item_id=ii.id
where imi.product_id=${param1};`;
    const queryExecuted = await db.execute(queryUnion);

    const result = queryExecuted[0] as unknown as IItem[];
    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva", async (c) => {
    const param1 = 9; //c.req.query("item_id");
    const data = await c.req.json();
    console.log("nueva receta");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  })
  .post("/nueva_detalle", async (c) => {
    const data = await c.req.json();
    console.log("Detalle nueva receta");
    console.log("Data en post");
    console.log(data);
    //insert para nueva receta
    //const insertR = `insert into inv_recipe(company_id,recipe,menu_item_id,save_tag) values(?,?,?,?)`;

    const result = await db.insert(inv_recipe_mix).values(data).$returningId();

    console.log("res : ", result);
    return c.json({ data: result, message: "ok" });
  });
