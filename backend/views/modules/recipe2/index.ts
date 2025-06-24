import { db } from "#app/database.ts";
import { IListaInsumo } from "@scope/shared";
import { Hono } from "hono";
//import { IListaInsumo } from "./backend/shared/modules/recetas/index.ts";
/*import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
*/

export const recipeRouter = new Hono().get("/filter/insumos", async (c) => {
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
  const queryUnion = `select ii.id as item_id, ii.item_name as item_name
, null as "category_id", null as "category_name" 
, imp.id as product_id, imp.product as product_name, imp.recipe_req
, null as recollect_id, null as collection_name
 from inv_menu_product imp
inner join inv_menu_items imi
on imp.id = imi.product_id
inner join inv_recipe ir
on imi.id = ir.menu_item_id
inner join inv_recipe_mix irm
on ir.id = irm.recipe_id
inner join inv_item ii
on irm.item_id = ii.id
where imp.product like '%${param1}%'
union
select 
 ii.id as item_id, ii.item_name as item_name
, ic.id as category_id, ic.category as category_name 
, null as product_id, null as product_name, null as recipe_req
,irc.id as recollect_id, irc.collection _name
from inv_recollection irc
inner join inv_recollection_mix ircm
on irc.id = ircm.recollection_id
inner join inv_item ii
on ircm.item_id = ii.id
left join inv_category ic
on ii.category_id = ic.id
where irc.collection like '%${param1}%'
union
select ii.id as item_id, ii.item_name
, ic.id as category_id, ic.category as category_name
, null as product_id, null as product_name, null as recipe_req
, null as recollect_id, null as collection_name
from inv_item ii 
left join inv_category ic
on ii.category_id = ic.id
where ii.item_name like '%${param1}%';`;
  //const queryFecha = "select Now() as fecha";
  const queryExecuted = await db.execute(queryUnion);

  const result = queryExecuted[0] as unknown as IListaInsumo[];
  console.log("res : ", result);
  return c.json({ data: result, message: "ok" });
});
